import React from 'react';
import { Link } from 'react-router-dom';
const CategoryRow = ({ category }) => {
  return (
    <div style={{
      display: 'flex', // Enable flexbox
      alignItems: 'flex-start', // Vertically align items in the center
      justifyContent: 'space-between', // Distribute space between items
      flexWrap: 'wrap', // Allow items to wrap to the next line if needed
      padding: '10px', // Add some padding around the items
      borderBottom: '1px solid #ccc', // Add a bottom border to separate rows
      marginBottom: '10px', // Add some margin to the bottom of each row
      flexDirection: 'column'
    }}>
      <Link to={`${category.Name}`} style={{ marginRight: '20px', fontWeight: 'bold' }}> 
        {category.Name}
      </Link>
      <p style={{margin: '0px', flex: 1}}>{category.description}</p>
      <div style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
        <p style={{margin: '0px'}}>Subcategories:</p>

        {category.subcategories.map((cat, index) => (
          <Link to={`${category.Name}/${cat.name}`} key={index} style={{marginRight: '5px'}}>{cat.name}</Link>
        ))}

              
      </div>
      <p style={{margin: '0px'}}>Resources: {category.resources.length}</p>
    </div>
  );
};

export default CategoryRow;
