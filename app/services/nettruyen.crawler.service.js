const Crawler = require('crawler');
const Category = require("../models/category.model.js");
const Ebook = require("../models/ebook.model.js");
const Chapter = require("../models/chapter.model.js");
const ChapterDetail = require("../models/chapterDetail.model.js");

const TimTruyenPage = require("../nettruyen/timtruyen.page");
const NetTruyenEbook = require("../nettruyen/nettruyen.ebook");
const Helper = require("../helper/helper.js");

const nettruyen = function () {

};
nettruyen.crawlerCategory = result => {
    TimTruyenPage.FindAllMegaMenu('http://www.nettruyentop.com').then(res => {
        result(null, res)
    }).catch(err => {
        result(err, null)
    })
}
nettruyen.crawler_ebook_by_source = (ebook_source, result) => {
    NetTruyenEbook.CrawlerEbook(ebook_source).then(data => {
        result(null, data);
    }).catch(err => {
        result(err, null)
    })
}
nettruyen.crawler_ebook_list = (url, result) => {

}

module.exports = nettruyen;