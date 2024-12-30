import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import ResourceList from './ResourceList'; 
import CategoryCard from './components/categories/categoryCard';
import Breadcrumbs from './components/general/breadCrumbs';
import CategoryRow from './components/common_forum/CategoryRow';

function collectAndSortResources(category) {
  let allResources = [];

  // Helper function to recursively collect resources
  const collectResources = (cat) => {
    if (cat.resources && cat.resources.length > 0) {
      allResources = allResources.concat(cat.resources);
    }
    if (cat.subcategories && cat.subcategories.length > 0) {
      cat.subcategories.forEach((subcat) => collectResources(subcat));
    }
  };

  // Start the recursion with the top-level category
  collectResources(category);

  // Sort the resources by created_at
  

  return allResources;
}

// Use the function




const CategoryContainer = ({ category, categories, currentPath, postType}) => {
  //fetch here maybe?
  console.log("postfig:", postType)
  const [postTypeID, setPostTypeID] = useState(postType.id);
  const [postTypeName, setPostTypeName] = useState(postType.name);
  
  const [link, setLink] = useState( `/add_new/${postType.id}` );

  console.log("CATS:", categories)
  
useEffect(() => {
  // Update state based on the current postType prop
  setPostTypeID(postType.id);
  setPostTypeName(postType.name);
  setLink(`/add_new/${postType.id}`);
}, [postType, postType.id]); // Watch for changes in postType and postType.id

// Rest of your component...

  useEffect(() => {
    if (category) {
      setLink(`/add_new/${postType.id}?cat=${category.ID}`);
    } 
  }, [category, postType.id]);

  
  
  
  const imageUrl = category ? category.file && category.file.length > 0 
        ? category.file[0].path.replace(/\\/g, '/') 
    : 'path/to/default/image.jpg' : '';
  
  const headerStyle = {
    display: 'flex',
    backgroundImage: `url(/${imageUrl })`, // Replace with your arrow image
    backgroundSize: 'cover', // Cover the area
    backgroundPosition: 'center', // Center the image
    height: "180px",
    borderRadius: '15px',
    width: '100%'
    
  }
  const headerTextBox = {
    height: '100%',
    display: 'flex',
    position: 'relative',
  }
  const headerText = {

    position: 'absolute',
    bottom: '0',
    paddingLeft: "30px",
    color: "white",
    textShadow: "0 1px 2px rgba(0,0,0,.5)",
  }

  if (category) {
    console.log("CAT:", category)
    return (  
      <> <div  className='category-container-wrapper'>
        <h2>{postTypeName}</h2>
        <Breadcrumbs path={currentPath} />
        
        <div className='innerCatHolder'>
          <div style={headerStyle}>
            <div style={ headerTextBox}>
              <h2 style={headerText}>{category.Name}</h2>
            </div>
          </div>
            <a className='make-new' href={link}> <span>+</span> Make new</a> 
          <p>{category.description}</p>
          
          
          {postType.displayConfig.allowCategoryCards ?
            
              category.subcategories.length > 0 && (
                <div className='flex' style={{width: "100%", marginBottom: "35px"}}>
                {category.subcategories.map(sub => {
                    console.log("SUB:", sub)
                  return (
                    <CategoryCard key={sub.ID} category={sub} />
                  )
                })}
                </div>
              )
            : null}
          

          
          {false && postType.displayConfig.classicForum ?
          category.subcategories.length > 0 && (
            <div className='flex' style={{width: "100%", marginBottom: "35px",  flexDirection: 'column'}}>
              
              {category.subcategories.map(sub => (
                  <CategoryRow key={sub.ID} category={sub} />  ))}
              </div>
          )
          : null}
        
      </div>
        <ResourceList categoryId={category.ID} resources={category.resources} currentPath={currentPath} postType={postType}
          displayConfig={postType.displayConfig} /> 
        </div>
      </>
    );
  }

  if (categories) {
    const allResources= categories.map(category => collectAndSortResources(category)).flat();
    allResources.sort((a, b) => new Date(b.created_at)- new Date(a.created_at));
    console.log("allResources:", allResources)
    console.log("CATSSS:", categories)

    let showAllConfig = postType.displayConfig;
    showAllConfig.categoryName = true;
    console.log("CATS:", categories)
    return (
      <>
                <div className='category-container-wrapper'>
    

        {showAllConfig.allowCategoryCards ? 
      <div className='flex'>
        {categories.map(category => (
          <CategoryCard key={category.ID} category={category} />
        ))}
            </div> : null}

          
          {postType.displayConfig.classicForum ?
            <div className='flex' style={{width: "100%", marginBottom: "35px", flexDirection: 'column'}}>
              
              {categories.map(sub => (
                  <CategoryRow key={sub.ID} category={sub} />  ))}
              </div>
          
          : null}


              
             <a className='make-new' href={link}> <span>+</span> Make new</a> 
        {showAllConfig.allowShowAllRecent ?
          <>
        <h2>Most recent {postTypeName}</h2>
         <ResourceList resources={allResources} currentPath={currentPath} postType={postType}
              displayConfig={showAllConfig} />
        </>    
            : null}
        </div>

      </>
    );
  }

  return null;
};




export default CategoryContainer;
