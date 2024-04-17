const mongoose = require('mongoose');

async function initialize() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}
const themeSchema = new mongoose.Schema({
    id: Number,
    name: String
}, {collection: 'themes'});

const setSchema = new mongoose.Schema({
    set_num: { type: String, unique: true },
    name: String,
    year: Number,
    theme_id: Number,
    num_parts: Number,
    img_url: String,
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' }
});

const Theme = mongoose.model('Theme', themeSchema);
const Set = mongoose.model('Set', setSchema);

async function initialize() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
    }
}

/*
const setDate = require('../data/setData.json');
const themeData = require('../data/themeData.json');


async function insertData() {
    await Theme.insertMany(themeData);
    const themes = await Theme.find();
    const themeMap = themes.reduce((map, theme) => ({...map, [theme.id]: theme._id}), {});
    const updatedSets = setDate.map(set => ({...set, theme: themeMap[set.theme_id]}));
    await Set.insertMany(updatedSets);
}

async function insertData() {
    try {
        // Insert themes
        await Theme.insertMany(themeData);
        console.log('Themes inserted successfully.');

        // Fetch themes to map theme IDs to MongoDB ObjectIds
        const themes = await Theme.find();
        const themeMap = themes.reduce((map, theme) => {
            map[theme.id] = theme._id;
            return map;
        }, {});

        // Update sets with theme ObjectIds and insert
        const updatedSets = setDate.map(set => ({
            ...set,
            theme: themeMap[set.theme_id] // Map theme ID to MongoDB ObjectId for theme reference field
        }));

        await Set.insertMany(updatedSets);
        console.log('Sets inserted successfully.');
    } catch (error) {
        console.error('Failed to insert data:', error);
    }
}

insertData();
*/

async function createTheme(data) {
    try {
        const theme = new Theme(data);
        await theme.save();
        console.log('Theme created:', theme);
        return theme;
    } catch (error) {
        console.error('Error creating theme:', error);
        throw error;
    }
}

async function getAllThemes() {
    try {
        const themes = await Theme.find();
        return themes;
    } catch (error) {
        console.error('Error retrieving all themes:', error);
        throw error;
    }
}

async function updateSet(setNum, updateData) {
    try {
        const set = await Set.findOneAndUpdate({ set_num: setNum }, updateData, { new: true }).populate('theme');
        if (!set) {
            throw new Error(`Set with set_num ${setNum} not found`);
        }
        console.log('Updated set:', set);
        return set;
    } catch (error) {
        console.error(`Error updating set with set_num ${setNum}:`, error);
        throw error;
    }
}   

async function deleteSet(setId) {
    try {
        const result = await Set.findByIdAndDelete(setId);
        if (!result) {
            throw new Error('Set not found');
        }
        console.log('Deleted set:', result);
    } catch (error) {
        console.error('Error deleting set:', error);
        throw error;
    }
}

async function getSetByNum(setNum) {
    try {
        const set = await Set.findOne({ set_num: setNum }).populate('theme');
        return set;
    } catch (error) {
        console.error(`Error finding set by number ${setNum}:`, error);
        throw error;
    }
}

module.exports = {
    /*insertData*/
    initialize,
    createTheme,
    getAllThemes,
    updateSet,
    deleteSet,
    Theme, 
    Set,
    getSetByNum
};