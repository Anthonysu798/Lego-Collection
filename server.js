/********************************************************************************
*  WEB322 – Assignment 04
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

const { Theme } = require('./modules/legoSets');
const { deleteSet } = require('./modules/legoSets');
const Set = require("./modules/legoSets").Set;


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

// Initialize the lego set data first
legoData.initialize().then(() => {});

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
app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme)
            .then(sets => {
                res.render("sets", { sets: sets, theme: theme });
            })
            .catch(err => {
                console.error(err);
                res.status(404).render("404", { message: `No sets found for theme: ${theme}` });
            });
    } else {
        legoData.getAllSets()
            .then(sets => {
                res.render("sets", { sets: sets, theme: null });
            })
            .catch(err => {
                console.error(err);
                res.status(500).render("404", { message: "An internal error occurred." });
            });
    }
});

app.get("/lego/sets/:set_num", async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const set = await legoData.getSetByNum(setNum);
        if (!set) {
            res.status(404).render('404', { message: "Set not found." });
            return;
        }
        const themes = await legoData.getAllThemes();  // Assuming you might need themes for detailing
        res.render("setDetails", { set, themes });
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
        const themes = await Theme.findAll();
        res.render('addSet', { themes });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send(`Unable to load add set page due to error: ${error.message}`);
    }
});
  
app.post('/lego/addSet', async (req, res) => {
    try {
        const { name, year, num_parts, img_url, theme_id, set_num } = req.body;
        await legoData.Set.create({ name, year, num_parts, img_url, theme_id, set_num });
        res.redirect('sets');
    } catch (error) {
        console.error('Failed to add set:', error);
        if (fs.existsSync(path.join(__dirname, '/views/500.ejs'))) {
            res.status(500).render('500', { message: `Internal server error: ${error.message}` });
        } else {
            res.status(500).send(`Internal server error: ${error.message}`);
        }
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
    console.log("POST /lego/editSet route hit", req.body);
    const { set_num, name, year, num_parts, theme_id } = req.body;
    try {
        await Set.update({ name, year, num_parts, theme_id }, { where: { set_num } });
        console.log('Update successful');
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Database update failed:', error);
        res.status(500).render("500", { message: `Failed to update set: ${error.message}` });
    }
});

// Delete route
app.get("/lego/deleteSet/:num", (req, res) => {
    const setNum = req.params.num;
    deleteSet(setNum)
    .then(() => {
        console.log(`Successfully deleted set: ${setNum}`);
        res.redirect('/lego/sets');
    })
    .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
    });
});

// If no route if found then send the user to the 404 
app.use((req, res) => {
    res.status(404).render('404', { message: `I'm sorry, we're unable to find what you're looking for.` });
});


app.listen(HTTP_PORT, () => {
    console.log(`Server running on port localhost:${HTTP_PORT}`);
});

