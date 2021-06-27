
module.exports = app => {
    const nettruyen = require("../controllers/nettruyen.controller.js");

    app.get("/crawler-category", nettruyen.crawlerCategory);

    app.get("/crawler-ebooks-by-source", nettruyen.crawler_ebook_list)

    app.get("/crawler_ebook_list", nettruyen.crawlerEbookBySource)

    app.get("/crawler_ebook_chapter_by_category", nettruyen.CrawlEbookChapterByCategory)

    app.get("/crawl_all_nettruyen", nettruyen.CrawlAllNetTruyen)

    app.get("/crawl_chapter_by_ebooksource", nettruyen.CrawlAndSaveChapter)

    app.get("/crawler_ebook_by_category", nettruyen.CrawlEbookByCategory)

    app.get("/download_ebook_image", nettruyen.dowloadEbookImage)

    app.get("/recreate_ebook_cate", nettruyen.reCreateEbookCate)

    app.get("/download_chapter_images", nettruyen.DownloadChapterImage)

    app.get("/download_chapter_images_from_list_ebook", nettruyen.DownloadChapterImageFormListEbook)
};