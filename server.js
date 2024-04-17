/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anthony Su Student ID: 142714229 Date: 07/04/2024
*  Published URL: copper-pangolin-tie.cyclic.app/
*
********************************************************************************/


require('dotenv').config('../.env');
const legoData = require("./modules/legoSets");
const express = require('express');

const { Theme, Set } = require('./modules/legoSets');



const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const fs = require('fs');

// Use ejs
app.set("view engine", "ejs")

const path = require('path');

// Assign port
const HTTP_PORT = process.env.PORT || 3000;

// Make the public folder to public
app.use(express.static('public'));

// Route to default page
app.get('/', (req, res) => {
    res.render("home");
}); 

// Route to about page
app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
}); 

// Route to views 404.html
app.get('/404', (req, res) => {
    res.status(404).render("404", { message: "Page not found." });
});

// Route to lego sets
app.get('/lego/sets', async (req, res) => {
    let query = {};
    const { theme } = req.query;

    if (theme) {
        const themeDoc = await Theme.findOne({ name: theme });
        if (themeDoc) {
            query.theme = themeDoc._id;
        } else {
            return res.status(404).render('404', { message: `No sets found for theme: ${theme}` });
        }
    }

    try {
        const sets = await Set.find(query).populate('theme');
        res.render("sets", { sets, theme: theme || null });
    } catch (err) {
        console.error('Error fetching sets:', err);
        res.status(500).render("404", { message: `An internal error occurred: ${err.message}` });
    }
});


app.get("/lego/sets/:set_num", async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const set = await legoData.getSetByNum(setNum);
        if (!set) {
            return res.status(404).render('404', { message: "Set not found." });
        }
        // Since the theme is populated, we can directly access its properties
        res.render("setDetails", { set });
    } catch (error) {
        console.error('Error fetching set details:', error);
        res.status(500).render('500', { message: "Failed to load set details." });
    }
});





// Route to lego set by theme demo
app.get('/lego/sets/theme-demo', (req, res) => {
    legoData.getSetsByTheme('tech')
    .then(sets => res.json(sets))
    .catch(err => res.status(404).send(`Theme cannot be found, error: ${err.message}`));
});

// Assignment 5
app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await Theme.find();
        res.render('addSet', { themes });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send(`Unable to load add set page due to error: ${error.message}`);
    }
});
  
app.post('/lego/addSet', async (req, res) => {
    try {
        const { name, year, num_parts, img_url, theme_id, set_num } = req.body;

        const theme = await Theme.findOne({ id: parseInt(theme_id) });
        if (!theme) {
            return res.status(404).send('Theme not found');
        }

        const newSet = new Set({ 
            set_num, 
            name, 
            year, 
            num_parts, 
            img_url, 
            theme: theme._id 
        });
        
        await newSet.save();
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Failed to add set:', error);
        res.status(500).render('500', { message: `Internal server error: ${error.message}` });
    }
});


// Route to lego set by number demo
app.get("/lego/editSet/:set_num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        if (!set) throw new Error("Set not found");

        const themes = await legoData.getAllThemes();
        res.render("editSet", { themes, set });
    } catch (err) {
        console.log(err); 
        res.status(404).render("404", { message: "Set not found" });
    }
});

app.post('/lego/editSet', async (req, res) => {
    const { set_num, name, year, num_parts, theme_id } = req.body;
    try {
        // Find the MongoDB ObjectId for the theme based on the theme_id provided
        const theme = await Theme.findOne({ id: theme_id });
        if (!theme) {
            return res.status(404).send('Theme not found');
        }

        // Use the correct function to update the set
        const updatedSet = await legoData.updateSet(set_num, {
            name,
            year,
            num_parts,
            theme: theme._id 
        });

        console.log('Update successful', updatedSet);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Database update failed:', error);
        res.status(500).render("500", { message: `Failed to update set: ${error.message}` });
    }
});

// Delete route
app.get("/lego/deleteSet/:num", async (req, res) => {
    const setNum = req.params.num;
    try {
        await Set.findOneAndDelete({ set_num: setNum });
        res.redirect('/lego/sets');
    } catch (err) {
        console.error(`Error deleting set: ${err.message}`);
        res.status(500).render("500", { message: `Failed to delete set: ${err.message}` });
    }
});

// If no route if found then send the user to the 404 
app.use((req, res) => {
    res.status(404).render('404', { message: `I'm sorry, we're unable to find what you're looking for.` });
});

legoData.initialize().then(() => {
    console.log('Database connected successfully');
    // Start the server here or ensure routes are setup after this promise resolves
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port localhost:${HTTP_PORT}`);
});

