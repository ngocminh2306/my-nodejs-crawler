
module.exports = app => {
    const kites = require("../controllers/kites.controller");

    app.get("/kites/crawl-list-posts", kites.CrawlerListPostController);

};