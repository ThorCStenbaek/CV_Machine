import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

 const styles = {
        textDecoration: 'none',
        color: 'black',
        fontSize: '16px',

    }

const Breadcrumbs = ({ path }) => {
  const pathSegments = path.split('/').filter(Boolean); // Split the path and remove any empty strings
  const breadcrumbLinks = pathSegments.map((segment, index, arr) => {
      const link = `/${arr.slice(0, index + 1).join('>')}`; // Create the link for this breadcrumb
      


    return (
      <React.Fragment key={link}>
        <Link style={styles} to={link}>{segment}</Link>
        {index < arr.length - 1 && ' > '} {/* Add a separator except for the last item */}
      </React.Fragment>
    );
  });

   
    
    
  return (
    <div style={{textAlign: 'left'}}>
      <Link style={styles} to="/">Home</Link> {/* Link to home */}
      {' > '}
      {breadcrumbLinks}
    </div>
  );
};

export default Breadcrumbs;
