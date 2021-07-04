
module.exports = app => {
    const Dtruyen = require("../controllers/dtruyen.controller.js");

    app.get("/crawler-category-dtruyen", Dtruyen.crawlerCategory);
};