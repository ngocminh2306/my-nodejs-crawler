const CommonCrawler = require('../helper/common.crawler');
const Chapter = require("../models/chapter.model.js");
const Ebook = require("../models/ebook.model");
const Category = require("../models/category.model");
const CrawlerLog = require("../models/crawler.log.model")
const NetTruyenChapter = require("../nettruyen/nettruyen.chapter");
const TimTruyenPage = require("../nettruyen/timtruyen.page")
const EbookCategoryRelated = require("../models/ebook.category.related.model");
const DtruyenTextEbook = function () { };

/**
 * Trả về kết quả tất cả ebook và chapter của category đó
 * @param {url category trang nguồn để crawl tất cả ebook của cate đó} url 
 * @returns 
 */
DtruyenTextEbook.CrawlEbookChapterByCategory = (url) =>{

}

module.exports = DtruyenTextEbook;