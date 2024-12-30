import React, {useState, useEffect} from 'react';

const CategorySelect = ({ categoryId, onCategoryChange, hasNull }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(categoryId || null);

    useEffect(() => {
        const fetchNestedCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/nested-categories');
                if (response.ok) {
                    const result = await response.json();
                    setCategories(result.data);
                    if (category===null) {
                        setCategory(result.data[0].ID)
                        onCategoryChange(result.data[0].ID)
                    }
                } else {
                    throw new Error('Error fetching nested categories.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNestedCategories();
    }, []);

    if (isLoading) return <p>Loading categories...</p>;
    if (error) return <p>Error loading categories: {error}</p>;




    const recursiveCategoryOptions = (categories, prefix = '') => {
        return categories.map(category => (
            <React.Fragment key={category.ID}>
                <option value={category.ID}>
                    {prefix + category.Name}
                </option>
                {category.sub_categories && recursiveCategoryOptions(category.sub_categories, prefix + '--')}
            </React.Fragment>
        ));
    };

return (
    <select value={category ?? ""} onChange={e => { onCategoryChange(e.target.value === "" ? null : e.target.value); setCategory(e.target.value) }}>
            {hasNull && <option value="">None</option>}
            {recursiveCategoryOptions(categories)}
        </select>
    );
};

export default CategorySelect;
