const { db, closeConnection } = require('./database_core');
const { getUserId,createUserTable,createUserRolesTable, createUserRoleNamesTable,  insertUserRoleName, deleteUserRoleName, updateUserRoleName, insertUser, loginUser, getUserFullName,  getUserDetailsGroupsAndRoles,
    getAllUsersDetailsGroupsAndRoles, getAllRoleNames,getUserDetails, createUserColorTable,
  insertUserColor,
    getUserColor,updateUserColor, IsUserIdAdmin, getUsersByRoleName  } = require('./database_user');
const { asyncInsertCategory,getCategoryByName,createCategoryTable, insertCategory, updateCategory, deleteCategory,unfoldCategories, createAllowedCategoriesTable, insertResourceTypeAndAllowedCategories,getNestedCategories,getCategoryIdsForPostType,insertAllowedCategories,doInsert,getPostTypesByCategory, createFileCategoryTable, insertOrUpdateFileCategory, getFilesByCategoryId,updateAllowedCategories }= require('./database_categories')
const {createResourceTable, createResourceTypeNameTable,createResourceTypeTable, createRatingTable, createSavedResourcesTable, createResourceCommentsTable,insertResourceTypeName, updateResourceTypeName, getResourcesByCategory, insertComment, countCommentsForResource, getCommentsForResource, getAllResourceTypeNames, getResourceById,updateResource,     createResourceLastUpdatedTable,
    setLastUpdated,
    getLastUpdated,
    checkIfDateTimeMatches, conditionalDeleteComment  }= require('./resources/db_resources')

const { createGroupsTable, createUserGroupsTable, insertGroup,
    insertUserToGroup,
    addUserToGroupByName,getAllGroupsAndUsers, removeMultipleUsersFromGroups,removeUserFromGroup, createParentGroupsTable } = require('./database_user_groups')

const { createResourcePermissionsTable, insertResourcePermission, getResourcePermissions, getResourceAssociations, removeUserResourcePermission } = require('./resources/db_resource_permissions')

const { createFilesTable,
    insertIntoFiles,
  getFileByID,getFilesForUser, createFilePermissionsTable,getFileIdByPath,      findFileResourcesAndUsers, getFilesByUserID} =require('./database_upload_files')

const{createResourceMetaTable,
createResourceClassesNamesTable,
createResourceClassesTable,
insertNewResource,getResourceMetaByResourceId, removeResourceMetaByResourceId,
    insertResourceMetaRows  } = require('./resources/db_resource_meta')

const {    createEditorsTable,
    createAllowedEditorsPostTypeTable,
    createResourceToEditorTable,
    insertEditor,
    insertAllowedEditorsPostType,
    insertResourceToEditor,
    getAllEditors,
    getPostTypesByEditorID,
    getEditorsByPostTypeID,
    getEditorByResourceID } = require('./resources/db_resource_editors')


const{ createPostTypeDisplayConfigTable,
    updatePostTypeDisplayConfig,
    getDisplayConfigByPostId} = require('./resources/db_resource_displayConfig')


const { enrichResources } = require('./resources/db_resource_enrichment')

const {createFileCategoriesTable,
  createFileCategoryAssociationsTable, insertFileCategory,
    getAllFileCategories,
    deleteFileCategory, insertFileCategoryAssociation,
    getFileCategoryAssociations,
    deleteFileCategoryAssociation,
    getFileIDsByCategory,  updateFileCategoryAssociations
    
} = require('./database_file_categories')

const { createRightsIdTable,
    createImageToRightsTable,
    insertIntoRightsId,
    insertIntoImageToRights,
    getAllFromRightsId,
    getRightsByFileId 
    
} = require('./database_image_rights')

const {createResourceToParentTable,
    getUsersForResource,
    removeUserFromResource,
    addResourceToUser,     createUserToUserLinkTable,
    getParentUserIdsForSosuUser,
    updateParentUserIdsForSosuUser,updateResourceUsers, getResourcesForUser,addLinkBetweenUsers } = require('./resources/db_resource_share_parents')

const {    createResourceImagePathTable,
    getImagePathsByResourceId,
    insertImagePaths, generateAndInsertScreenshots} = require('./resources/db_resource_screenshots')

/*This is mainly for aggregating all database methods and returning them as a single instance. */

const createAllTables = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await createUserTable();
            await createUserRolesTable();
            await createUserRoleNamesTable();

            await createCategoryTable();

            await createResourceTable();
            await createResourceTypeNameTable();
          await createResourceTypeTable();
          
          //user color
          await createUserColorTable(),

          //display config
          await createPostTypeDisplayConfigTable();


   //files
            await createFilesTable()
          
            await createRatingTable();
            await createSavedResourcesTable();
            await createResourceCommentsTable();

          await createAllowedCategoriesTable();

            await createResourceMetaTable();
            await createResourceClassesTable();
          await createResourceClassesNamesTable()

          //groups and permissions
          await createGroupsTable()
          await createUserGroupsTable()
          await createResourcePermissionsTable()
          await createParentGroupsTable()
       
          //editors
          await createEditorsTable()
    await createAllowedEditorsPostTypeTable()
    await createResourceToEditorTable()
          
          //createFilePermissionsTable 
          await createFilePermissionsTable()
          await createFileCategoryTable()

          //file categories
          await createFileCategoriesTable()
          await createFileCategoryAssociationsTable()


          //share with parents: 
          await createResourceToParentTable()
          await createUserToUserLinkTable()


          //rights for images
          await createRightsIdTable()
          await createImageToRightsTable()


          //screenshots
          await createResourceImagePathTable()


          //time for resources
          await  createResourceLastUpdatedTable()
          
          await insertEditor("Upload File", "Allow uploading files", "Upload File")
          await insertEditor("Simple Editor", "Just a simple Editor", "Simple Editor")
          await insertEditor("Advanced Editor", "Editor that let's you make multiple rows and columns", "admin")


          await insertIntoRightsId("https://openclipart.org/")

          await insertIntoRightsId("https://mulberrysymbols.org/")

          await insertIntoRightsId("http://tawasolsymbols.org/")

          await insertIntoRightsId("http://arasaac.org/")

            await insertUserRoleName('ADMIN');
        await insertUserRoleName('SOSU');
        await insertUserRoleName('PARENT');
        await insertResourceTypeName("Resources","resource","resource", "resources");
        await insertResourceTypeName("Forum", "Forum Posts", "post", "posts");

        const userId = await new Promise((resolve, reject) => {
            insertUser('thor', 'thcs@itu.dk', 'Thor', 'Stenbaek', 'thor', 'ADMIN', (err, userId) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    reject(err);
                } else {
                    console.log('User inserted with ID:', userId);
                    resolve(userId);
                }
            });


        });


            console.log('All tables created successfully.');
            resolve();
        } catch (error) {
            console.error('Error creating tables:', error);
            reject(error);
        }
    });
}



const user = {
    insertUser: insertUser,
    loginUser: loginUser,
  getUserId: getUserId,
  getUserFullName: getUserFullName,
   getUserDetailsGroupsAndRoles,
  getAllUsersDetailsGroupsAndRoles, 
  getUserDetails,
    insertUserColor,
  getUserColor,
  updateUserColor,
  IsUserIdAdmin,
  isAdmin: IsUserIdAdmin,
    getUsersByRoleName
    
};

const userRoles = {
  insertUserRoleName: insertUserRoleName,
  deleteUserRoleName: deleteUserRoleName,
  updateUserRoleName: updateUserRoleName,
  getAllRoleNames
};


const categories = {
  insertCategory: insertCategory,
  updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    unfoldCategories: unfoldCategories,
    getCategoryByName: getCategoryByName,
  asyncInsertCategory: asyncInsertCategory,
  getResourcesByCategory: getResourcesByCategory,
  insertResourceTypeAndAllowedCategories,
  getNestedCategories,
  getCategoryIdsForPostType,
  insertAllowedCategories,
  doInsert,
  getPostTypesByCategory,
  insertOrUpdateFileCategory,
  getFilesByCategoryId,
  updateAllowedCategories
};

const screenshots = {
  getImagePathsByResourceId,
  insertImagePaths,
  generateAndInsertScreenshots,
  createResourceImagePathTable
}

const resources= {
insertResourceTypeName: insertResourceTypeName,
updateResourceTypeName: updateResourceTypeName,
insertResource: insertNewResource,
getResourceMetaByResourceId: getResourceMetaByResourceId,
  getResourcesByCategory: getResourcesByCategory ,
insertComment: insertComment,
  countCommentsForResource,
  getCommentsForResource,
  getAllResourceTypeNames,

  updatePostTypeDisplayConfig,
    getDisplayConfigByPostId,
  getResourceById,
  enrichResources,
     removeResourceMetaByResourceId,
    insertResourceMetaRows,
  updateResource,
  screenshots: screenshots,
        createResourceLastUpdatedTable,
    setLastUpdated,
    getLastUpdated,
  checkIfDateTimeMatches,
    conditionalDeleteComment

}
const rights = {
  insertIntoRightsId,
  insertIntoImageToRights,
  getAllFromRightsId,
  getRightsByFileId,
  createRightsIdTable,
  createImageToRightsTable

}

const files = {
  insertIntoFiles,
  getFileByID,
  getFilesForUser,
  getFileIdByPath,
  getFilesByUserID,
  findFileResourcesAndUsers,
  insertFileCategory,
    getAllFileCategories,
  deleteFileCategory,
    insertFileCategoryAssociation,
    getFileCategoryAssociations,
    deleteFileCategoryAssociation,
  getFileIDsByCategory,
  updateFileCategoryAssociations,
  rights: rights
    

}
const groups = {
  insertGroup,
    insertUserToGroup,
  addUserToGroupByName,
  getAllGroupsAndUsers,
  removeUserFromGroup,
  removeMultipleUsersFromGroups
    
}
const permissions = {
  insertResourcePermission,
  getResourcePermissions,
  getResourceAssociations,
  removeUserResourcePermission
}

const editors = {
  insertEditor,
  insertAllowedEditorsPostType,
  insertResourceToEditor,
  getAllEditors,
  getPostTypesByEditorID,
  getEditorsByPostTypeID,
  getEditorByResourceID
}
const tables = {
  createAllTables,
   createUserTable,
           createUserRolesTable,
            createUserRoleNamesTable,

            createCategoryTable,

            createResourceTable,
           createResourceTypeNameTable,
         createResourceTypeTable,
          
          //user color
         createUserColorTable,

          //display config
         createPostTypeDisplayConfigTable,


   //files
           createFilesTable,
          
            createRatingTable,
            createSavedResourcesTable,
            createResourceCommentsTable,

          createAllowedCategoriesTable,

            createResourceMetaTable,
            createResourceClassesTable,
         createResourceClassesNamesTable,

          //groups and permissions
         createGroupsTable,
          createUserGroupsTable,
          createResourcePermissionsTable,
       
          //editors
         createEditorsTable,
   createAllowedEditorsPostTypeTable,
   createResourceToEditorTable,
          
          //createFilePermissionsTable 
          createFilePermissionsTable,
          createFileCategoryTable,

          //file categories
         createFileCategoriesTable,
  createFileCategoryAssociationsTable,
         createResourceToParentTable

}

const parent = {
  createResourceToParentTable,
    getUsersForResource,
    removeUserFromResource,
  addResourceToUser,
        createUserToUserLinkTable,
    getParentUserIdsForSosuUser,
  updateParentUserIdsForSosuUser,
  updateResourceUsers,
  getResourcesForUser,
    addLinkBetweenUsers
}





module.exports = {
  db,
  closeConnection,
  createAllTables,
    user,
    userRoles,
    categories, 
  resources,
  files,
  groups,
  permissions,
  editors,
  tables,
  parent,

};
