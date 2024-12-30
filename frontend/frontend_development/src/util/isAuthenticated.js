// isAuthenticated.js

// Assuming you're using the 'js-cookie' library for cookie management
// If not, you can install it using npm install js-cookie
import Cookies from 'js-cookie';

const isAuthenticated = () => {
  // Retrieve the login cookie
  const loginCookie = Cookies.get('loginCookie');

  // Check if the cookie exists and is valid
  // For simplicity, we're just checking for the existence of the cookie
  // In a real-world scenario, you might want to verify the cookie value with the server
  if (loginCookie) {
    return true;
  }

  return false;
};

export default isAuthenticated;
