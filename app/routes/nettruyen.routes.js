
module.exports = app => {
    const nettruyen = require("../controllers/nettruyen.controller.js");

    app.get("/crawler", nettruyen.crawler);
    
    app.get("/crawler-ebooks", nettruyen.crawlerEbook);

    app.get("/crawler-ebooks-detail", nettruyen.crawlerEbookDetail);

    app.get("/crawler-chapter-detail", nettruyen.crawlerChapterDetail);

    app.get("/crawler-ebooks-by-source", nettruyen.crawlerEbookBySource)
};