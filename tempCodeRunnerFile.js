app.get('/lego/editSet/:num', async (req, res) => {
    const setNum = req.params.num;
    try {
        const set = await legoData.getSetByNum(setNum);
        if (!set) {
            res.status(404).render("404", { message: "Set not found." });
            return;
        }
        const themes = await Theme.findAll();
        res.render("editSet", { set: set, themes: themes }); // Ensure "editSet.ejs" exists
    } catch (err) {
        console.error(err);
        res.status(500).render("500", { message: "An error occurred." });
    }
});