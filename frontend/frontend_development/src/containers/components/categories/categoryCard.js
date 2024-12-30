import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation


const CategoryCard = ({ category }) => {

    console.log("CATEGORYCARD", category)

    const imageUrl = category.file && category.file.length > 0 
        ? category.file[0].path.replace(/\\/g, '/') 
        : 'path/to/default/image.jpg'; // Replace with your default image path

    console.log("CARD", category, imageUrl)
    const cardStyle = {
        width: '200px', // Set the width of the card
        margin: '10px', // Spacing between cards
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Box shadow like in the image
        textAlign: 'center', // Center text
        backgroundColor: '#fff', // White background
        borderRadius: '10px', // Rounded corners
        overflow: 'hidden', // Ensures nothing overflows from the card
        position: 'relative', // For positioning the link arrow
        height: "350px"
    };

    const imageStyle = {
        width: '100%', // Full width
        height: '120px', // Set a fixed height
        objectFit: 'cover', // Cover the card area
    };

    const titleStyle = {
        fontWeight: 'bold', // Bold title text
        margin: '10px 0', // Some spacing between title and description
        color: "black"
    };

    const descriptionStyle = {
        color: 'gray', // Gray text for description
        fontSize: '0.9em', // Smaller text for description
    };

    const linkStyle = {
        TextDecoration: 'none', // Remove underline from link

    }

function escapeUrl(url) {
    return url.replace(/\(/g, '%28').replace(/\)/g, '%29');
}

// Usage example:
const innerStyle = {
    backgroundImage: `url(/${escapeUrl(imageUrl)})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "60%"
};

    console.log("INNER", innerStyle)    

    return (
        <div style={cardStyle} className='category-card'>
            <Link to={`${category.Name}`}  className='card-link'>
                <div style={innerStyle}>
                   
                </div>
                <div>
            <h4 style={titleStyle}>{category.Name}</h4>
            <p style={descriptionStyle}>{category.description}</p>
                    <p style={{marginBottom: '5px'}}>Resources: {category.resources.length}</p>
                    <p style={{marginTop: '0px'}}>Sub categories:  {category.subcategories.length }</p>
                </div>  
             <div className='card-overlay'> </div>   
            </Link>
            
        </div>
    );
};

export default CategoryCard;
