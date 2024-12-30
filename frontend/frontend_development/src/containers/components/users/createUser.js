import React, { useState, useEffect, useContext } from 'react'; // <-- Import useEffect
import SearchSelect from '../general/searchSelect';
import CurrentUserContext from '../../../util/CurrentUserContext';
import CoolInput from '../general/coolInput';

const AddUserForm = ({onhandleSubmit}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        userRolesName: '',
    });
    const [roles, setRoles] = useState([]); // <-- Use state to store roles
    const [message, setMessage] = useState('');
    const [parentSelected, setParentSelected] = useState(false);
    const [allowEmail, setAllowEmail] = useState(false);
    console.log("EMAIL:", allowEmail)

    const currentUser = useContext(CurrentUserContext);
    console.log("PERM", currentUser)

    useEffect(() => {
        // Fetch roles when the component mounts
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/all-role-names');
                const data = await response.json();
                setRoles(filterUsers(currentUser, data.roleNames));
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'userRolesName' && value === 'PARENT') { //Hard codeed value, needs to be changed with language
            setParentSelected(true);
        }
        else if (name === 'userRolesName' && value !== 'PARENT') {
            setParentSelected(false)
        } /*
        else if (name === 'firstname' && formData.username=='' || name === 'lastname' && formData.username=='' ) {
            setFormData((prevData) => ({
                ...prevData,
                username: prevData.firstname + prevData.lastname
            }));
        } */
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        let localformData= {...formData};
        if (localformData.username == '')
            localformData.username = localformData.firstname + localformData.lastname;
    try {
        const response = await fetch('/api/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
            onhandleSubmit(formData.username);
            setMessage(`User added with ID: ${data.userId} and username: ${formData.username}.`);
            // Optionally, reset the form data after a successful submission:
            console.log("CURRENT USER", currentUser)
            if (!parentSelected)
                return; //guard block so we only add actual parents to sosu

            const newResponse = await fetch('/api/add-single-parent', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({sosuUserId: currentUser.currentUser.id, parentID: data.userId})});
            const newData = await newResponse.json();
            if (newData.success) {
                setMessage('User added and assigned to the current user.');
            } else {
                setMessage('Error adding user.');
            }

            setFormData({
                username: '',
                email: '',
                firstname: '',
                lastname: '',
                password: '',
                userRolesName: '',
            });


        } else {
            setMessage('Error adding user.');
        }
    } catch (error) {
        setMessage('An error occurred while adding the user.');
        console.error('Error:', error);
    }
};


return (
    <div>
        <h2>Add User</h2>
        <form onSubmit={handleSubmit} className='flex'>

            <label htmlFor="userRolesName">Role:</label>
            <select id="userRolesName" name="userRolesName" value={formData.userRolesName} onChange={handleInputChange}>
                <option value="" disabled>Select Role</option>
                {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>

                        {parentSelected ? <>
            <label>Allow email </label>
                    <input type="checkbox" checked={allowEmail} onChange={(e)=> setAllowEmail(e.target.checked) }></input></> : null}

            <div style={{display: 'flex', gap: '15px'}}>

            <CoolInput label="Username" name="username"  onChangeE={handleInputChange} required />


            {!parentSelected || allowEmail ?
              
                <CoolInput label="Email" name="email"   onChangeE={handleInputChange} required />
                : null
                
                
             

                }
                
                </div>



                    
      
             <div style={{display: 'flex', gap: '15px'}}>
            
        <CoolInput label={parentSelected ? "First name initials:" :"First Name:"} name="firstname"  onChangeE={handleInputChange} maxLength={parentSelected ? "2" : "255"} required />


        <CoolInput label={parentSelected ? "Last name initials:" :"Last Name:"} name="lastname"  onChangeE={handleInputChange} maxLength={parentSelected ? "2" : "255"} required />
            </div>

        <CoolInput label="Password" name="password" type='password'  onChangeE={handleInputChange} required />
    

            <button type="submit">Add User</button>
        </form>
        {message && <p>{message}</p>}
    </div>
);

};

export default AddUserForm;

function filterUsers(currentUser, list) {
    
    if (currentUser.currentUser.role.roleName === 'ADMIN') {
        return list;
    }

        if (currentUser.currentUser.role.roleName === 'SOSU') {
        return ['PARENT'];
    }


    return list.filter(user => user.id === currentUser.id);
}