const setData = require("../data/setData.json");

const themeData = require("../data/themeData.json");

let sets = [];

// Initialize function() 

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(set => {
                const theme = themeData.find(theme => theme.id === set.theme_id);
                let themeName = theme ? theme.name : "Undefined"; 
                return {
                    ...set,
                    theme: themeName
                };
            });
            resolve(); 
        } catch (error) {
            reject("Error message: " + error); 
        }
    });
}


// Get all set function 

function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets); // If sets have data in it then resolve
        } else {
            reject("Sorry, no sets is found");
        }
    });
}

// Get set by numbers
// Will return a specific "set" object from the "sets" array
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        let foundSet = sets.find(set => set.set_num === setNum)
        if (foundSet) {
            resolve(foundSet);
        } else {
            reject("Sorry, Set cannot be found with the number you provided");
        }
    });
}

// Get sets by theme 
function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        // Convert theme to lower case letters for comparison
        let themeLowercase = theme.toLowerCase();
        
        // Filter sets by theme
        const filteredSets = sets.filter(set => set.theme.toLowerCase().includes(themeLowercase));
        
        if (filteredSets.length > 0) {
            resolve(filteredSets); // Resolve with the filtered sets
        } else {
            reject(`Sorry cannot find set with theme you have provided`); 
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }; 
