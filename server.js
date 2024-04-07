/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anthony Su Student ID: 142714229 Date: 14/02/2024
*  Published URL: copper-pangolin-tie.cyclic.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");

const express = require('express');

const app = express();

// Use ejs
app.set("view engine", "ejs")

const path = require('path');

// Assign port
const HTTP_PORT = process.env.PORT || 50;

// Make the public folder to public
app.use(express.static('public'));

// Initialize the lego set data first
legoData.initialize().then(() => {});

// Route to default page
app.get('/', (req, res) => {
    // Assignment 3 res.sendFile(path.join(__dirname, "/views/home.html"))

    // Assignment 4 require
    res.render("home");
}); 

// Route to about page
app.get('/about', (req, res) => {
    // Assignment 3 res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render('about', { page: '/about' });
}); 

// Route to views 404.html
app.get('/404', (req, res) => {
    // Render 404 page with a default message
    res.status(404).render("404", { message: "Page not found." });
});


/* Assignment 3
// Route to lego sets
app.get('/lego/sets', (req, res) => {
    // Example http://localhost:8080/lego/sets?theme=Supplemental only return supplemental
    if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme)
            .then(sets => res.json(sets))
            .catch(err => res.status(404).send(`Theme: ${req.query.theme} cannot be found, error: ${err.message}`));
    } else {
        legoData.getAllSets()
            .then(sets => res.json(sets))
            .catch(err => res.status(404).send(`No sets have found, error: ${err.message}`));
    }
});
*/

// Assignment 4
app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
    legoData.getAllSets()
        .then(sets => {
            if (theme) {
                sets = sets.filter(set => set.theme === theme);
                if (!sets.length) {
                    // If no sets found for the theme, render the 404 page with a theme-specific message
                    res.status(404).render("404", { message: `No sets found for theme: ${theme}` });
                    return;
                }
            }
            res.render("sets", { sets: sets, theme: theme });
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("404", { message: "An internal error occurred." });
        });
});


// Route to lego set by number demo
app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;

    legoData.getSetByNum(setNum)
        .then(set => {
            if (set) {
                // If the set is found, render the set detail page
                res.render('setDetails', { set: set });
            } else {
                // If the set is not found, render the 404 page with a custom message
                res.status(404).render('404', { message: `Unable to find requested sets.` });
            }
        })
        .catch(err => {
            console.error(err);
            // If an error occurs, render the 404 page with a custom message
            res.status(500).render('404', { message: "Unable to find requested sets." });
        });
});


// Route to lego set by theme demo
app.get('/lego/sets/theme-demo', (req, res) => {

    // send request to get the set by theme
    legoData.getSetsByTheme('tech')
        .then(sets => res.json(sets))

        .catch(err => res.status(404).send(`Theme cannot be found, error: ${err.message}`));
});

// If not route if found then send the user to the 404 
app.use((req, res) => {
    // Render the 404 page with a custom message
    res.status(404).render('404', { message: `I'm sorry, we're unable to find what you're looking for.` });
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port localhost:${HTTP_PORT}`);
});