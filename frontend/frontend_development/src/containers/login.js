import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfileData from './profilePage';
import CenteredWrapper from './components/micro_components/centeredWrapper';
import CoolInput from './components/general/coolInput';


function Login() {
  const [identifier, setIdentifier] = useState(''); // Renamed from email to identifier
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [IsLoggedIn, setIsLoggedIn] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/set-cookie', { identifier, password }); // Adjusted email to identifier
      setMessage(response.data);
      checkCookie();
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage('An error occurred during the login process.');
      }
    }
  };

  const checkCookie = async () => {
    try {
      const response = await axios.get('/api/check-cookie');
      setMessage(response.data.message);
      if (response.data.success) {
        setIsLoggedIn(true);
     
      }
    } catch (error) {
      setMessage('Failed to check cookie.');
    }
  };

  useEffect(() => {
    checkCookie()
    
   }, [IsLoggedIn]);

  if (IsLoggedIn) {

    return (
      <CenteredWrapper>
        <UserProfileData/>
        </CenteredWrapper>
    )
  }
  
  return (<>
    <div style={{display: 'flex', flexDirection: 'column'}}>
    <h2>Pycipedia</h2>
    <div>
      <h2>Login</h2>
        <div>
          <CoolInput label={"Username or Email"} onChange={setIdentifier} type='text'/>


      </div>
      <div>
        <CoolInput label={"Password"} onChange={setPassword} type='password'/>
      </div>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      </div>
      </div>
    </>
  );
}

export default Login;
