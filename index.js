const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://toni798:oYBS3R31IjDBeV6i@assignment6.egeygpp.mongodb.net/')

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

const setDate = require('./data/setData.json');
const themeData = require('./data/themeData.json');

/*
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

async function updateSet(setId, updateData) {
    try {
        const set = await Set.findByIdAndUpdate(setId, updateData, { new: true });
        if (!set) {
            throw new Error('Set not found');
        }
        console.log('Updated set:', set);
        return set;
    } catch (error) {
        console.error('Error updating set:', error);
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

module.exports = {
    insertData,
    createTheme,
    getAllThemes,
    updateSet,
    deleteSet
};