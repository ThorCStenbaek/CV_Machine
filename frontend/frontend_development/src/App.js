import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React,{ useState, useEffect, createContext } from 'react';
import Login from './containers/login';
import CategoryContainer from './containers/CategoryContainer'
import ResourceDetails from './containers/ResourceDetails'
import './styles/css.css'
import FileUploadComponent from './containers/components/file_upload';
import NewResourceComponent from './containers/components/newResource';
import UsersAndGroupsContainer from './containers/usersAndGroups';
import CategoriesContainer from './containers/categoryBoxes';
import ParentComponent from './containers/postTypeMaker';
import InsertCategoryComponent from './containers/components/categories/insertCategory';
import UserProfileData from './containers/profilePage';
import QuillComponent from './containers/components/quill/quillTest';
import Header from './containers/components/header/header';
import PathsContext from './util/PathsContext';
import FileUploadAndGallery from './containers/components/images/fileUploadAndGallery';

import CenteredWrapper from './containers/components/micro_components/centeredWrapper';
//hello
import CurrentUserContext from './util/CurrentUserContext';

import NameInitialsAvatar from './containers/components/micro_components/NameInitialsAvatar';

import CustomEditor from './custom_editor/CustomEditor';
import BaseQuill from './containers/components/quill/baseQuill';
import ElementBuilder from './containers/components/elementBuilder';
import EditPostComponent from './containers/EditPostComponent';

import Profile from './containers/components/profile/Profile';
import SelectedAvailableBoxes from './containers/components/general/SelectedAvailableBoxes';
import UsersToParents from './containers/userToParent';
import JustTheResource from './containers/components/micro_components/justTheResource';

import ClassicForum from './containers/components/classic_forum/classic_forum';

import isAdmin from './util/isAdmin';
import About from './pages/about';
import Footer
  from './containers/components/footer/footer';


const generateRoutes = (categories, basePath = "", type) => {
  let routes = [];
  
  console.log("genty",type)
  categories.forEach(category => {
    const currentPath = `${basePath}/${category.Name}`;
    routes.push(
      <Route 
        key={category.ID} 
        path={currentPath} 
        element={ <CenteredWrapper><CategoryContainer category={category} currentPath={currentPath} postType={type} /> </CenteredWrapper>}
      /> 
    );
    category.resources.forEach(resource => resource.categoryName = category.Name)
      
    category.resources.forEach(resource=> {
      const newpath = `${currentPath}/${type.post_name}/${resource.title}`.replace(/ /g, "_");

      console.log(newpath)
     routes.push(
      <Route 
        path={newpath} 
         element={<CenteredWrapper><ResourceDetails resource={resource} displayConfig={type.displayConfig } /> </CenteredWrapper>}
      />
     );
      console.log("making routes", resource)

     })
    if (category.subcategories.length > 0) {
      routes = routes.concat(generateRoutes(category.subcategories, currentPath, type));
    }
  });

  return routes;
};
  //give me a similar function that does something similar to the generateRoutes function but instead of returning a list of routes it returns a list of paths
  // but just this part: 
  /*
        routes.push(
          //just the resource
          <Route path={`/resource${resource.id}`} element={<CenteredWrapper><JustTheResource resource={resource} /> </CenteredWrapper>} />
        )
 */

  const generateJustResourceThings = (categories) => {
    let routes = [];

    categories.forEach(category => {
      category.resources.forEach(resource => {
        routes.push(
          //just the resource
          <Route path={`/resource${resource.id}`} element={<JustTheResource resource={resource} />} />
        )
      });
    });
  
    return routes;
  };


const generateResourcePathsMap = (categories, basePath = "", type) => {
  let pathsMap = new Map();
  console.log("generateResourcePathsMap", categories);
  console.log("genty", type);

  const generatePaths = (categories, basePath) => {
    categories.forEach(category => {
      const currentPath = `${basePath}/${category.Name}`;

      // Process resources of the current category
      category.resources.forEach(resource => {
        const newPath = `${currentPath}/${type.post_name}/${resource.title}`.replace(/ /g, "_");
        console.log(newPath);
        pathsMap.set(resource.id, newPath);
      });

      // Process subcategories
      if (category.subcategories.length > 0) {
        generatePaths(category.subcategories, currentPath);
      }
    });
  };

  generatePaths(categories, basePath);
  return pathsMap;
};


const generateAllResourcePaths = (categoriesData, idToType) => {
  let allPathsMap = new Map();

  Object.keys(categoriesData).forEach(type => {
    const basePath = `/${idToType[type].name}`;
    const pathsMap = generateResourcePathsMap(categoriesData[type], basePath, idToType[type]);

    // Merge current pathsMap into allPathsMap
    pathsMap.forEach((value, key) => {
      allPathsMap.set(key, value);
    });
  });

  return allPathsMap;
};





function App() {
  const [categoriesData, setCategoriesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // New state variable
  const [postTypes, setPostTypes] = useState([]); // New state variable
  const [idToType, setidToType] = useState({}); // New state variable
  const [allPaths, setAllPaths] = useState({}); // New state variable
  const [currentUser, setCurrentUser] = useState({});// New state variable


  const fetchCategoriesByType = async (postType) => {
    try {
      const response = await fetch(`/api/categories?postType=${postType}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (err) {
      throw err;
    }
  };
  

  const fetchDisplayConfigByType = async (postType) => {
    try {
      const response = await fetch(`/api/post-display-config/${postType}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (err) {
      throw err;
    }
  };

  const fetchResourceTypesAndCategories = async () => {
    try {
      const resTypesResponse = await fetch('/api/all-resource-types'); 
      if (!resTypesResponse.ok) {
        throw new Error('Error fetching resource types');
      }
      const resTypesData = await resTypesResponse.json();

      let categoriesByType = {};
      let types= {};
      for (const type of resTypesData.data) {
        const categories = await fetchCategoriesByType(type.id);
        categoriesByType[type.id] = categories;
        type.displayConfig= (await fetchDisplayConfigByType(type.id)).data
       types[type.id] = type;
      }
      console.log("posts", resTypesData.data)
      setidToType(types)
      setPostTypes(resTypesData.data)
      setCategoriesData(categoriesByType);
      setLoading(false);


      const allPathsMap = generateAllResourcePaths(categoriesByType, types);
      setAllPaths(allPathsMap);

    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchResourceTypesAndCategories();
    } catch (error) {
      
    }
    
  }, []);

  const fetchUserInformation = async () => {
    try {
      const response = await fetch('/api/get-user-details');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (err) {
      throw err;
    }
   }

  useEffect(() => {
    try {
      fetchUserInformation().then(data => {setCurrentUser(data); console.log("userRP", data) })
    } catch (error) {
      
    }
   },[])

   return (
   
   <Router>
        <Routes>
          <Route path="/" element={<CustomEditor/>}></Route> </Routes></Router>
)

  if (!isAuthenticated) {
    return <CenteredWrapper><Login /> </CenteredWrapper>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    //return <div> <SelectedAvailableBoxes text="for testing"></SelectedAvailableBoxes>      </div>
       return <CenteredWrapper><Login /> </CenteredWrapper>;
    return <div>Error: {error.message}</div>;
  }
  console.log("allPaths", allPaths)
  return (
    <PathsContext.Provider value={{ allPaths, setAllPaths }}>
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
    <Router>
      <Routes>

        {Object.keys(categoriesData).map((type) => {
                return (
                <React.Fragment key={type}>
      {generateJustResourceThings(categoriesData[type])} 
      </React.Fragment> ) } ) }

      </Routes>

        <Header types={idToType } />

      <Routes>
        <Route path="/login" element={<CenteredWrapper><Login /> </CenteredWrapper>} />

        {Object.keys(categoriesData).map((type) => {
          // Base path for each resource type
          
          const basePath = `/${idToType[type].name}`;
          
        
          if (idToType[type].displayConfig.classicForum) {
            
            return (
                <React.Fragment key={type}>
              <Route path={basePath} element={<ClassicForum  categories={categoriesData[type]} postType={idToType[type]} />} />
              {generateRoutes(categoriesData[type], basePath, idToType[type])}
              </React.Fragment>
            )


          } 

          return (
            
            <React.Fragment key={type}>
              <Route path={basePath} element={<CenteredWrapper><CategoryContainer categories={categoriesData[type]} postType={idToType[type]} /> </CenteredWrapper>} />
              {generateRoutes(categoriesData[type], basePath, idToType[type])}
              </React.Fragment>
            
          );
        })}


        {(postTypes).map((type) => {
          
          const  basePath = `/add_new/${type.id}`;
          return (
            <Route path={basePath} element={  <NewResourceComponent postType={type} />} />

          )

         })

        }

          { isAdmin(currentUser) && <>
        <Route path='/admin/users' element={<CenteredWrapper><UsersAndGroupsContainer/> </CenteredWrapper> } />
               <Route path='/admin/types' element={<CenteredWrapper> <ParentComponent /> </CenteredWrapper> } />
        <Route path='/admin/categories' element={ <CenteredWrapper> <InsertCategoryComponent /> </CenteredWrapper> } />

              <Route path='/admin/user-parents' element={<UsersToParents />} />
              </>
            }
        <Route path="/editing/:postID" element={<EditPostComponent />} /> {/* Dynamic route for editing posts */}


        <Route path='/about' element={<About />} />

            <Route path='/profile' element={<CenteredWrapper> <Profile /> </CenteredWrapper>} />

          <Route path='/quill' element={<QuillComponent />} />
            <Route path='/bildBank' element={<CenteredWrapper><FileUploadAndGallery displayConfig={{ CanBeSelected: false }} /> </CenteredWrapper>} />
            <Route path='/ppf' element={<NameInitialsAvatar firstName="John" lastName="Doe"></NameInitialsAvatar>}></Route>
            

            <Route path='/base' element={<BaseQuill />}></Route>
            

        <Route path="/*" element={<CenteredWrapper><Login /> </CenteredWrapper>} />
        
          </Routes>
          
          <Footer></Footer>
        </Router>
        </CurrentUserContext.Provider>
    </PathsContext.Provider>
    
  );
}



export default App;
