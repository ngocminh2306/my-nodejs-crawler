
module.exports = app => {
    const nettruyen = require("../controllers/nettruyen.controller.js");

    app.get("/crawler-category", nettruyen.crawlerCategory);

    app.get("/crawler-ebooks-by-source", nettruyen.crawlerEbookBySource)
};