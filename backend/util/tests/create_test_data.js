const dbUtils = require('./../database/database'); //nice and packed





const metaInfo = [
    {
        ordering: 1,
        html_element: 'div',
        number_of_children: 0,
        specific_style: 'color: red;',
        content_type: 'text',
        content_data: 'Some text',
        instruction: 'DEFAULT'
    }
    // Add more meta info objects as needed
];

const classNames = ['class1', 'class2'];


//await dbUtils.resources.insertResource(1, 1, 'Resource Title', 'Description', 1, 'TypeName', metaInfo, classNames, 'Some instruction');


const initialDatabase = async () => {
    try {
        await dbUtils.createAllTables();
        await dbUtils.userRoles.insertUserRoleName('ADMIN');
        await dbUtils.userRoles.insertUserRoleName('SOSU');
        await dbUtils.userRoles.insertUserRoleName('PARENT');
        await dbUtils.resources.insertResourceTypeName("Resources","resource","resource", "resources");
        await dbUtils.resources.insertResourceTypeName("Forum", "Forum Posts", "post", "posts");

        const userId = await new Promise((resolve, reject) => {
            dbUtils.user.insertUser('thor', 'thcs@itu.dk', 'Thor', 'Stenbaek', 'thor', 'ADMIN', (err, userId) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    reject(err);
                } else {
                    console.log('User inserted with ID:', userId);
                    resolve(userId);
                }
            });


        });


        const createTestUsers = async () => {
                let userIds = [];

                for (let i = 1; i <= 20; i++) {
                    let username = `test${i}`;
                    let email = `test${i}@test.dk`;

                    try {
                        const userId = await new Promise((resolve, reject) => {
                            dbUtils.user.insertUser(username, email, 'test', 'test', 'test', 'ADMIN', (err, userId) => {
                                if (err) {
                                    console.error('Error inserting user:', err);
                                    reject(err);
                                } else {
                                    console.log('User inserted with ID:', userId);
                                    resolve(userId);
                                }
                            });
                        });
                        userIds.push(userId);
                    } catch (err) {
                        console.error(`Failed to create user ${username}:`, err);
                    }
                }

                return userIds;
        };
        //MAKE GROUPS AND ADD USERS TO THEM 
        const createGroupsAndAddUsers = async () => {
            // Create test users
            const testUserIDs = await createTestUsers();
            
            // Create 10 groups
            const groupNames = Array.from({ length: 10 }, (_, i) => `group${i + 1}`);
            for (let groupName of groupNames) {
                await dbUtils.groups.insertGroup(groupName);
            }

            // For each group, add at least 2 random user IDs
            for (let groupName of groupNames) {
                // Shuffle the array of user IDs
                const shuffledUserIDs = testUserIDs.sort(() => 0.5 - Math.random());

                // Select at least 2 user IDs
                const selectedUserIDs = shuffledUserIDs.slice(0, 2 + Math.floor(Math.random() * (testUserIDs.length - 2)));

                for (let userId of selectedUserIDs) {
                    await dbUtils.groups.addUserToGroupByName(userId, groupName);
                }
            }

            console.log("All groups created and users added.");
        };

        createGroupsAndAddUsers();

        
        // If you want to uncomment the below line in the future:
        // await dbUtils.resources.insertResource(1, 1, 'Resource Title', 'Description', 1, 'TypeName', metaInfo, classNames, 'Some instruction');

    } catch (error) {
        console.error('An error occurred:', error);
    }
};

// To execute the function:



/*


   dbUtils.resources.getResourcesByCategory(1).then(result => {
        console.log("result: ",result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    




       dbUtils.resources.getResourceMetaByResourceId(5).then(result => {
        console.log("meta: ",result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
*/
const insertAllCategories = async () => {
    try {
        const categoriesData = [
            ['Electronics', 'Devices and gadgets', 1, null],
            ['Fashion', 'Clothing and accessories', 1, null],
            ['Books', 'Literature and educational materials', 1, null],
            ['Home & Garden', 'Home decor and gardening tools', 1, null],
            ['Sports', 'Sporting goods and accessories', 1, null],
            ['Mobiles', 'Smartphones and feature phones', 1, 'Electronics'],
            ['Laptops', 'Portable computers', 1, 'Electronics'],
            ['Cameras', 'Digital cameras and DSLRs', 1, 'Electronics'],
            ['Audio', 'Headphones, speakers, and more', 1, 'Electronics'],
            ['Men\'s Wear', 'Clothing for men', 1, 'Fashion'],
            ['Women\'s Wear', 'Clothing for women', 1, 'Fashion'],
            ['Accessories', 'Watches, jewelry, and more', 1, 'Fashion'],
            ['Footwear', 'Shoes, sandals, and more', 1, 'Fashion'],
            ['Fiction', 'Novels and storytelling books', 1, 'Books'],
            ['Academic', 'Educational books and references', 1, 'Books'],
            ['Comics', 'Graphic novels and comics', 1, 'Books'],
            ['Horror', 'Scary and thrilling stories', 1, 'Fiction'],
            ['Romance', 'Love stories and romantic tales', 1, 'Fiction'],
            ['Science Fiction', 'Futuristic and speculative stories', 1, 'Fiction'],
            ['Cosmic Horror', 'Stories of incomprehensible horrors from the cosmos', 1, 'Horror']
        ];

        for (let [name, description, createdBy, subCategoryOfNameOrId] of categoriesData) {
            dbUtils.categories.insertCategory(name, description, createdBy, subCategoryOfNameOrId);
             await new Promise(resolve => setTimeout(resolve, 250));
        }

        console.log("All categories inserted successfully!");
    } catch (error) {
        console.error('Error inserting categories:', error);
    }
};




const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomString = length => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const generateRandomMetaInfo = () => {
    const metaInfoCount = randomIntFromInterval(1, 10);
    const metaInfo = [];
    const childrenOptions = [0, 0, 0, 0, 0, 1, 2, 3];
    for (let i = 0; i < metaInfoCount; i++) {
        metaInfo.push({
            ordering: i + 1,
            html_element: ['div', 'span', 'p', 'a'][randomIntFromInterval(0, 3)],
            number_of_children: childrenOptions[randomIntFromInterval(0, childrenOptions.length - 1)],
            specific_style: `color: ${['red', 'blue', 'green', 'yellow'][randomIntFromInterval(0, 3)]};`,
            content_type: 'text',
            content_data: randomString(5),
            instruction: 'DEFAULT'
        });
    }
    return metaInfo;
};


const generateRandomClassNames = () => {
    const classNamesCount = randomIntFromInterval(1, 5);
    const classNames = [];
    for (let i = 0; i < classNamesCount; i++) {
        classNames.push(`class${randomIntFromInterval(1, 10)}`);
    }
    return classNames;
};

let resourceAmount=0
const insertRandomResources = async N => {
    resourceAmount=N
    const statuses = ['draft', 'published', 'deleted', 'private']; // Possible statuses

    for (let i = 0; i < N; i++) {
        const metaInfo = generateRandomMetaInfo();
        const classNames = generateRandomClassNames();
        const status = statuses[Math.floor(Math.random() * statuses.length)]; // Randomly select a status
        const isPrivate = Math.random() > 0.5 ? 1 : 0; // Randomly generate boolean for isPrivate

        await dbUtils.resources.insertResource(
            randomIntFromInterval(1, 20), // random category_id
            1, // created_by
            randomString(10), // title
            randomString(15), // description
            1, // post_type
            randomString(8), // typeName
            metaInfo, // metaInfo
            classNames, // classNames
            status, // status - newly added
            isPrivate // isPrivate - newly added
        );
    }
    console.log("All randomized resources inserted successfully!");
    await insertRandomResourcePermissions();
};

const insertRandomResourcePermissions = async () => {
    const accessLevels = ['read', 'write', 'admin']; // Assumed possible access levels

    for (let i = 1; i <= resourceAmount; i++) {
        const resourceId = i; // Assuming resources are inserted with sequential IDs starting from 1

        // Decide primary assignment (user or group)
        const primaryAssignmentToUser = randomIntFromInterval(0, 1)
        let userId = null;
        let groupId = null;

        if (primaryAssignmentToUser==1) {
            userId = randomIntFromInterval(1, 19);
            // Optionally assign to a group as well
            if (randomIntFromInterval(0, 1)) {
                groupId = randomIntFromInterval(0, 9);
            }
        } else {
            groupId = randomIntFromInterval(1, 6);
            // Optionally assign to a user as well
            if (randomIntFromInterval(0, 1)) {
                userId = randomIntFromInterval(1, 19);
            }
        }

        const accessLevel = accessLevels[Math.floor(Math.random() * accessLevels.length)]; // Randomly select an access level

        await dbUtils.permissions.insertResourcePermission(resourceId, userId, groupId, accessLevel);
    }

    console.log("All randomized resource permissions inserted successfully!");
};


// Execute the function with N resources
  // Example: Inserting 5 random resources




module.exports={
insertAllCategories,
initialDatabase,
insertRandomResources

}
