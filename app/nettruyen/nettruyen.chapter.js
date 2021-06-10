const CommonCrawler = require('./common.crawler');
const EbookDetail = require("../models/ebookDetail.model.js");
const Chapter = require("../models/chapter.model.js");
const NetTruyenChapter = function () { };

NetTruyenChapter.CrawlerChapter = (chapter_source_url) => {
    return new Promise((resovle, reject) => {
        CommonCrawler.LoadPage(chapter_source_url).then(res => {
            let $ = res;
            let page = [];
            $('.reading-detail.box_doc .page-chapter img').each((i, element) => {
                let src = $(element).attr('src');
                page.push('http:' + src)
            });
            resovle(page)
        }).then(err => reject(err));
    })
}

module.exports = NetTruyenChapter;