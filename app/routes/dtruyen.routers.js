
module.exports = app => {
    const Dtruyen = require("../controllers/dtruyen.controller.js");

    app.get("/crawler-category-dtruyen", Dtruyen.crawlerCategory);
    app.get("/crawler-ebook-dtruyen", Dtruyen.CrawlEbookByCategory);
    app.get("/crawler-ebook-craetecate-dtruyen", Dtruyen.ReCreateEbookCate);
    
};