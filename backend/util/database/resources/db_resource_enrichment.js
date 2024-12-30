const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');
const { countCommentsForResource } = require('./../resources/db_resource_comments')

const {hasUserSavedResource } = require('./../resources/db_resource_saved')
const {getUserFullName } = require('./../database_user')
const {getRatingsForResource} =require('./../resources/db_resource_ratings')
const {getResourceAssociations} = require('./db_resource_permissions')


const getResourceTypeById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM resource_type_name WHERE id = ?`;

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                resolve(row);
            } else {
                resolve(null); // No data found for the given ID
            }
        });
    });
};


const getCategoryNameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Name FROM category WHERE ID = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row.Name);
      } else {
        resolve(null); // or reject(new Error('No category found with the given ID.'));
      }
    });
  });
};



const enrichResources = async (resources, userId) => {
    return await Promise.all(resources.map(async resource => {

        const commentCount = await countCommentsForResource(resource.id);
        const ratings = await getRatingsForResource(resource.id, userId);
        const userHasSaved = await hasUserSavedResource(userId, resource.id);
        const fullName = await getUserFullName(resource.created_by);
        const GroupAndUserPermissions = await getResourceAssociations(resource.id)
        const postType = await getResourceTypeById(resource.post_type);
        const categoryName = await getCategoryNameById(resource.category_id);
        return {
            ...resource,
            commentCount: commentCount,
            ratings: ratings,
            userHasSaved: userHasSaved,
            author: fullName,
            permissions: GroupAndUserPermissions,
            postTypeInformation: postType,
            categoryName: categoryName
        };
    }));
}

module.exports = {
    enrichResources,
    getResourceTypeById
}