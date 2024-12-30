import React from 'react';

const Category = ({ category, onCategoryClick, add = true, includeSubs = false, subLevel=0 }) => {

    if (!includeSubs && !(category.chosen || category.pseudoChosen)) {
        return null; // Only render chosen or pseudoChosen categories when includeSubs is false
    }

    let categoryStyle = category.pseudoChosen ? { color: 'grey' } : {};

    if (includeSubs && category.chosen) {
        categoryStyle = { color: "grey" };
    }
    if (!includeSubs && category.chosen) {
        categoryStyle = { color: 'black' };
    }

     const generateDashes = (level) => {
        let dashes = '';
        for (let i = 0; i < level; i++) {
            dashes += '-';
        }
        return dashes;
    };

    return (
        <li style={categoryStyle} onClick={(e) => {
            onCategoryClick(category, add);
            e.stopPropagation();  // Stop the event from propagating to parent elements
        }}>
            {generateDashes(subLevel)} {category.Name}
            <ul>
                {category.sub_categories && category.sub_categories.map(subCat => (
                    <>
                     
                     <Category 
                        key={subCat.ID} 
                        category={subCat} 
                        onCategoryClick={onCategoryClick} 
                        add={add} 
                        includeSubs={includeSubs}
                        subLevel={subLevel+1}
                        style={{ color: 'initial', textDecoration: "none" }}  // Override style for children
                        />
                        </>
                ))}
            </ul>
        </li>
    );
};

export default Category;
