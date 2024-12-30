    import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';

    import Category from './components/categories/category';


    const addParentField = (categories, parent = null) => {
        return categories.map(category => {
            let updatedCategory = { ...category, parent };
            if (category.sub_categories) {
                updatedCategory.sub_categories = addParentField(category.sub_categories, updatedCategory);
            }
            return updatedCategory;
        });
    }

    const addFieldsRecursively = (categories, chosenIds = []) => {
    return categories.map(category => {
        let updatedCategory = {
            ...category,
            chosen: chosenIds.includes(category.ID),
            pseudoChosen: false
        };

        if (category.sub_categories) {
            updatedCategory.sub_categories = addFieldsRecursively(category.sub_categories, chosenIds);
        }

        return updatedCategory;
    });
};




    const CategoriesContainer = forwardRef((props, ref) => {
        const [availableCategories, setAvailableCategories] = useState([]);
        const [selectedCategories, setSelectedCategories] = useState([]);
        const [allCategories, setAllCategories] = useState([]);


        

    const fetchAndEnhanceCategories = useCallback(() => {
        return fetch('/api/nested-categories')
            .then(response => response.json())
            .then(data => addFieldsRecursively(data.data, props.previousSelected));
    }, [props.previousSelected]); // the dependency ensures re-calculation if props.secondParameter changes

    useEffect(() => {
        fetchAndEnhanceCategories()
            .then(enhancedData => {
                setAllCategories(enhancedData);
                setAvailableCategories(enhancedData);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, [fetchAndEnhanceCategories]);



    const handleCategoryClick = (category, add = true) => {

        const updateCategories = (categories, targetID, add) => {
            let found = false;
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].ID === targetID) {
                    found = true;
                    categories[i].chosen = add;
                    if (!add && categories[i].sub_categories) {
                        categories[i].pseudoChosen = categories[i].sub_categories.some(cat => (cat.chosen || cat.pseudoChosen));
                    }
                } else if (categories[i].sub_categories) {
                    if (updateCategories(categories[i].sub_categories, targetID, add)) {
                        found = true;
                        if (add) {
                            categories[i].pseudoChosen = true;
                        } else {
                            categories[i].pseudoChosen = categories[i].sub_categories.some(cat => (cat.chosen || cat.pseudoChosen));
                        }
                    }
                }
            }
            return found;
        };

        const updatedCategories = [...availableCategories];
        updateCategories(updatedCategories, category.ID, add);
        setAvailableCategories(updatedCategories);
        console.log(availableCategories)
    };

        
            const getSelectedCategoryIds = () => {
            const extractIds = (categories) => {
                let ids = [];
                for (let cat of categories) {
                    if (cat.chosen || cat.pseudoChosen) {
                        ids.push(cat.ID);
                    }
                    if (cat.sub_categories) {
                        ids = [...ids, ...extractIds(cat.sub_categories)];
                    }
                }
                return ids;
            };

            return extractIds(availableCategories);
        };

        // Exposing the getSelectedCategoryIds function to the parent
        useImperativeHandle(ref, () => ({
            getSelectedIds: getSelectedCategoryIds
        }));




        return (
        <div className='flex'>
            <div className="available-categories">
                    <h2>Available Categories</h2>
                    <div className='innerDiv'>
                {availableCategories.map(category => (
                    <Category key={category.ID} category={category} onCategoryClick={handleCategoryClick} add={true} includeSubs={true} />
                ))}
                        </div>
            </div>

            <div className="selected-categories">
                    <h2>Selected Categories</h2>
                    <div className='innerDiv'>
                {availableCategories.map(category => (
                    <Category key={category.ID} category={category} onCategoryClick={handleCategoryClick} add={false} includeSubs={false} />
                ))}
                        </div>
            </div>
        </div>
    );

    });

    export default CategoriesContainer;


