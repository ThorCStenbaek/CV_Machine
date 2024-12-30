import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResourceList from '../../ResourceList';
import CategoryCard from '../categories/categoryCard';
import Breadcrumbs from '../general/breadCrumbs';
import CategoryRow from '../common_forum/CategoryRow';
import ClassicResourceList from './classic_resource_list';
//import classic forum css


import '../../../styles/classicForum.css';

import SmallCategoryNames from './small_category_name';


function collectAndSortResources(category) {
  let allResources = [];

  const collectResources = (cat) => {
    if (cat.resources && cat.resources.length > 0) {
      allResources = allResources.concat(cat.resources);
    }
    if (cat.subcategories && cat.subcategories.length > 0) {
      cat.subcategories.forEach((subcat) => collectResources(subcat));
    }
  };

  collectResources(category);

  return allResources;
}


function generateColors(n) {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hue = (i * 360) / n;
    const saturation = 80; // Percentage
    const lightness = 50; // Percentage
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
  }
  return colors;
}

function mapIntegersToColors(integers) {
  const uniqueIntegers = [...new Set(integers)];
  const colors = generateColors(uniqueIntegers.length);
  const colorMap = {};
  uniqueIntegers.forEach((int, index) => {
    colorMap[int] = colors[index];
  });
  return colorMap;
}


const getAllIDs =( categories) => {
    const allIDs = [];

    categories.forEach(cat => {

        allIDs.push(cat.ID);
        
        const subIDs = getAllIDs(cat.subcategories);
        allIDs.push(...subIDs);
        
    });

    return allIDs;


}



const ClassicForum = ({ category, categories, currentPath, postType }) => {
  const [postTypeID, setPostTypeID] = useState(postType.id);
  const [postTypeName, setPostTypeName] = useState(postType.name);
  const [link, setLink] = useState(`/add_new/${postType.id}`);

    const [colorsToIDs, setColorsToIDs] = useState(mapIntegersToColors(getAllIDs(categories)));
    
    console.log("CATS:", categories)
    
  useEffect(() => {
    setPostTypeID(postType.id);
    setPostTypeName(postType.name);
    setLink(`/add_new/${postType.id}`);
  }, [postType]);

  const imageUrl = category
    ? category.file && category.file.length > 0
      ? category.file[0].path.replace(/\\/g, '/')
      : 'path/to/default/image.jpg'
    : '';

  const headerStyle = {
    display: 'flex',
    backgroundImage: `url(/${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '180px',
    borderRadius: '15px',
    width: '100%',
  };

  const headerTextBox = {
    height: '100%',
    display: 'flex',
    position: 'relative',
  };

  const headerText = {
    position: 'absolute',
    bottom: '0',
    paddingLeft: '30px',
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,.5)',
  };

  if (category) {
    return (
        <>
            
     
            <SmallCategoryNames basePath={""} categories={categories} colors={colorsToIDs} />


        <div className='category-container-wrapper'>
          <Breadcrumbs path={currentPath} />
          <div className='innerCatHolder'>
            <div style={headerStyle}>
              <div style={headerTextBox}>
                <h2 style={headerText}>{category.Name}</h2>
              </div>
            </div>
            <a className='make-new' href={link}>
              <span>+</span> Make new
            </a>
            <p>{category.description}</p>

            {postType.displayConfig.allowCategoryCards && category.subcategories.length > 0 && (
              <div className='flex' style={{ width: '100%', marginBottom: '35px' }}>
                {category.subcategories.map((sub) => (
                  <CategoryCard key={sub.ID} category={sub} />
                ))}
              </div>
            )}

            {postType.displayConfig.classicForum && category.subcategories.length > 0 && (
              <div className='flex' style={{ width: '100%', marginBottom: '35px', flexDirection: 'column' }}>
                {category.subcategories.map((sub) => (
                  <CategoryRow key={sub.ID} category={sub} />
                ))}
              </div>
            )}

            <div className='topics'>
              <div className='topic-header'>
                <span>Topic</span>
                <span>Replies</span>
                <span>Views</span>
                <span>Activity</span>
              </div>
              {category.resources.map((resource) => (
                <div className='topic-row' key={resource.id}>
                  <div className='topic-title'>
                    <Link to={`/topic/${resource.id}`}>{resource.title}</Link>
                  </div>
                  <div className='topic-replies'>0</div>
                  <div className='topic-views'>0</div>
                  <div className='topic-activity'>{new Date(resource.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (categories) {
    const allResources = categories.map((category) => collectAndSortResources(category)).flat();
    allResources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    let showAllConfig = postType.displayConfig;
    showAllConfig.categoryName = true;

    return (
        <>
        <div style={{display: 'flex'}}>
            <div>
            <h4>Categories</h4>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <SmallCategoryNames basePath={""} categories={categories} colors={colorsToIDs} />
                </div>

                </div>
        <div className='category-container-wrapper'>
        

          <a className='make-new' href={link}>
            <span>+</span> Make new
          </a>
          {showAllConfig.allowShowAllRecent && (
            <>
              <h2>Most recent {postTypeName}</h2>
              <ClassicResourceList
                resources={allResources}
                currentPath={currentPath}
                postType={postType}
                                displayConfig={showAllConfig}
                                colors={colorsToIDs}
              />
            </>
          )}
                </div>
                </div>
      </>
    );
  }

  return null;
};

export default ClassicForum;