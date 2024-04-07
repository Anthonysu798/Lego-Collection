require('dotenv').config({ path: '../.env' });
const Sequelize = require('sequelize');
const setData = require('../data/setData.json');
/* 
const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");
*/

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    })

// Define Theme model 
const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: false // disable createdAt and updatedAt fields
});

// Define Set model
const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING
    },
    year: {
        type: Sequelize.INTEGER
    },
    num_parts: {
        type: Sequelize.INTEGER
    },
    theme_id: {
        type: Sequelize.INTEGER,
    },
    img_url: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false // Disable createdAt and updatedAt fields
});

// Create a relationship between Theme and Set
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

// Create the models with the database if they do not exist
sequelize.sync()
    .then(() => {
        console.log('Models created successfully.');
    })
    .catch((err) => {
        console.error('Unable to create models:', err);
    });

/* 
let sets = [];
*/


// Initialize function() 
// Loop through the themeData from the JSON file and insert each theme individually
/* 
function initialize() {
    return new Promise(async (resolve, reject) => {
        try {
            await sequelize.sync();

            // check for default themes in the DB 
            // get all of the themes from the database

            // if the themes length is === 0, then the DB doens't have any. 
            // loop through the themeData from the JSON file
            // insert each them individually.

            // check for default sets in the DB 
            // same as above, but for sets

            const existingThemes = await Theme.findAll();
            if (existingThemes.length === 0) {
                // Loop through the themeData from the JSON file and insert each theme individually
                for (const theme of themeData) {
                    await Theme.create(theme);
                }
                console.log('Themes from the JSON file have been inserted into the database.');
            } else {
                console.log('Database already contains themes. No need to insert default themes from the JSON file.');
            }
            resolve(); 
        } catch (error) {
            reject("Initialization failed: " + error); 
        }
    });
}

// Create and insert all the data from the theme json into the database
initialize()
    .then(() => {
        console.log("Initialization successful");
    })
    .catch((error) => {
        console.log("Initialization failed: " + error);
    });
*/ 


// Part 2
function initialize() {
    // Ensure the database is created and the tables are created if they do not exist 
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log('Database created successfully.');
                resolve();
            })
            .catch(error => {
                console.error('Failed to create database:', error);
                reject(error);
            });
    });
}







// Get all set function 

function getAllSets() {
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [Theme]
        })
        .then(sets => {
            resolve(sets);
        })
        .catch(error => {
            console.log("Error finding all sets: ", error); // Log an error message
            reject("Failed to retrieve all sets.") // Reject with an error message
        });
    });
}

// Get set by numbers
// Will return a specific "set" object from the "sets" array
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        Set.findOne({
            where: { set_num: setNum },
            include: [{
                model: Theme,
                attributes: ['id', 'name']
            }]
        })
        .then(set => {
            if (set) {
                console.log(`Found set: ${set.name}`);
                resolve(set.get({ plain: true })); 
            } else {
                reject(new Error(`Set with set_num ${setNum} not found`));
            }
        })
        .catch(err => {
            console.error(`Error finding set by number ${setNum}:`, err);
            reject(err);
        });
    });
}






// Get sets by theme 
function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [{
                model: Theme,
                where: { 
                    name: {
                        [Sequelize.Op.iLike]: `%${theme}%` // Case-insensitive search for the theme name
                    }
                }
            }]
        })
        .then(sets => {
            if(sets && sets.length > 0) {
                resolve(sets);
            } else {
                reject("Unable to find requested sets.");
            }
        })
        .catch(error => {
            console.log("Error finding sets by theme: ", error);
            reject("Failed to retrieve sets by theme.");
        });
    })
}



// Get all sets with themes
function getAllSetsWithThemes() {
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [{
                model: Theme,
                attributes: ['name'] 
            }]
        })
        .then(sets => {
            resolve(sets);
        })
        .catch(error => {
            console.log("Error finding all sets with themes: ", error);
            reject("Failed to retrieve all sets with themes.");
        });
    });
}

function getAllThemes() {
    return new Promise((resolve, reject) => {
        Theme.findAll()
            .then(themes => resolve(themes))
            .catch(error => {
                console.error("Error finding all themes: ", error);
                reject("Failed to retrieve all themes.");
            });
    });
}

// import setData to the database
function importSets() {
    return new Promise(async (resolve, reject) => {
        try {
            for (const set of setData) {
                await Set.findOrCreate({
                    where: { set_num: set.set_num },
                    defaults: {...set}
                });
            }
            console.log('LEGO sets from the JSON file have been inserted into the database.');
            resolve();
        } catch (error) {
            console.error('Failed to import LEGO sets:', error);
            reject(error);
        }
    });
}

// Delete function
function deleteSet(setNum) {
    return new Promise((resolve, reject) => {
        Set.destroy({
            where: { set_num: setNum }
        })
        .then(deletionCount => {
            if (deletionCount > 0) {
                console.log(`Deleted set with set_num: ${setNum}`);
                resolve();
            } else {
                throw new Error(`No set found with set_num ${setNum} to delete`);
            }
        })
        .catch(err => {
            console.error(`Error deleting set with set_num ${setNum}:`, err);
            reject(new Error(err.message || "Deletion failed due to an error."));
        });
    });
}





module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme,getAllThemes, deleteSet, Theme, Set};
