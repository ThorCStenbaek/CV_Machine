import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from 'react-router-dom';
import CategoryContainer from './../containers/CategoryContainer';

function CategoryPages() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('api/categories')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCategoriesData(data);
        setLoading(false);
      })
      .catch(err => {
        setCategoriesData([{"ID":5,"Name":"Mobiles","description":"Smartphones and feature phones","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:36","sub_category_of":null,"subcategories":[]},{"ID":6,"Name":"Laptops","description":"Portable computers","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:36","sub_category_of":null,"subcategories":[]},{"ID":7,"Name":"Cameras","description":"Digital cameras and DSLRs","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:36","sub_category_of":null,"subcategories":[]},{"ID":8,"Name":"Audio","description":"Headphones, speakers, and more","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:36","sub_category_of":null,"subcategories":[]},{"ID":4,"Name":"Sports","description":"Sporting goods and accessories","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:35","sub_category_of":null,"subcategories":[]},{"ID":1,"Name":"Fashion","description":"Clothing and accessories","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:35","sub_category_of":null,"subcategories":[{"ID":10,"Name":"Women's Wear","description":"Clothing for women","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:37","sub_category_of":1,"subcategories":[]},{"ID":11,"Name":"Accessories","description":"Watches, jewelry, and more","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:37","sub_category_of":1,"subcategories":[]},{"ID":12,"Name":"Footwear","description":"Shoes, sandals, and more","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:37","sub_category_of":1,"subcategories":[]},{"ID":9,"Name":"Men's Wear","description":"Clothing for men","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:37","sub_category_of":1,"subcategories":[]}]},{"ID":3,"Name":"Home & Garden","description":"Home decor and gardening tools","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:35","sub_category_of":null,"subcategories":[]},{"ID":2,"Name":"Books","description":"Literature and educational materials","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:35","sub_category_of":null,"subcategories":[{"ID":14,"Name":"Academic","description":"Educational books and references","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:38","sub_category_of":2,"subcategories":[]},{"ID":15,"Name":"Comics","description":"Graphic novels and comics","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:38","sub_category_of":2,"subcategories":[]},{"ID":13,"Name":"Fiction","description":"Novels and storytelling books","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:38","sub_category_of":2,"subcategories":[{"ID":17,"Name":"Romance","description":"Love stories and romantic tales","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:39","sub_category_of":13,"subcategories":[]},{"ID":18,"Name":"Science Fiction","description":"Futuristic and speculative stories","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:39","sub_category_of":13,"subcategories":[]},{"ID":16,"Name":"Horror","description":"Scary and thrilling stories","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:38","sub_category_of":13,"subcategories":[{"ID":19,"Name":"Cosmic Horror","description":"Stories of incomprehensible horrors from the cosmos","created_by":1,"created_at_date":"2023-09-16","created_at_time":"15:03:39","sub_category_of":16,"subcategories":[]}]}]}]}])
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
  

<>

          

{categoriesData.map(category => (
        <Route 
          key={category.ID} 
          path={`/${category.Name}`} 
          element={<CategoryContainer categories={category.subcategories} />}
        />
      ))}

</>


  );
};

export default CategoryPages;
