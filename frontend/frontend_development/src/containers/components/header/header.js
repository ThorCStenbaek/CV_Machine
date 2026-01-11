import React, {useState, useContext} from 'react';
import { Link, useNavigate   } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import CurrentUserContext from '../../../util/CurrentUserContext';
import isAdmin from '../../../util/isAdmin';


function Header(types) {
  const givenTypes = Object.values(types.types);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userContext = useContext(CurrentUserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      const data = await response.text(); // Or .json()
      console.log(data);
      navigate('/');
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header style={styles.header}>
          <Link to="/" style={styles.link}> <h1 style={styles.title}>CV Machine
</h1> </Link>
        <nav style={styles.nav}>
        
          {givenTypes.map((type) => {
            if (type.displayConfig.showInHeader) {
              return (
                <Link key={type.name} to={`/${type.name}`} style={styles.link}>{type.name}</Link>
              )
            }
            return null; // It's good practice to return null for conditional rendering in map
          })}
          <Link to="/bildBank" style={styles.link}>BildBank</Link>
           <Link to="/about" style={styles.link}>Om CV Machine</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          {isAdmin(userContext) ? <a style={styles.link} onClick={toggleMenu}>Admin Menu</a> : null }
         
          {/* Add a logout button */}
          <a onClick={handleLogout} style={styles.link}>Logout</a>
        </nav>
      </header>
      {isMenuOpen && <div style={styles.overlay} onClick={toggleMenu} />}
      {isMenuOpen && <SideMenu />}
    </>
  );
}

const SideMenu = ({ }) => (
  <div style={styles.sideMenu}>
    <h3>Admin</h3>

    <Link style={styles.otherlink} to="/admin/types" >Types</Link>
    <Link style={styles.otherlink} to="/admin/categories" >Categories</Link>
    <Link style={styles.otherlink} to="/admin/users" >Users</Link>
    <Link style={styles.otherlink} to="/admin/user-parents" >Sosu to parents</Link>

  </div>
);

// Basic styling for the header
const styles = {
  header: {
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    color: '#333'
  },
  nav: {
    display: 'flex',
  },
  link: {
    marginLeft: '20px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px'
  },
  otherlink: {
    marginLeft: '0px',
    textDecoration: 'none',
    color: '#333',
    marginTop: '15px',
    fontSize: '26px'
  }
  ,
  sideMenu: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    right: 0,
    width: '250px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
   zIndex: 11,
    transition: 'transform 0.3s ease-in-out',
    alignItems: 'center'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9
  }
};

export default Header;


