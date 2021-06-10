const CommonCrawler = require('../helper/common.crawler');
const Chapter = require("../models/chapter.model.js");
const NetTruyenChapter = function () { };

NetTruyenChapter.CrawlerChapter = (chapter_source_url) => {
    return new Promise((resovle, reject) => {
        CommonCrawler.LoadPage(chapter_source_url).then(res => {
            let $ = res;
            let datas = [];
            $('.reading-detail.box_doc .page-chapter img').each((i, element) => {
                let src = $(element).attr('src');
                datas.push('http:' + src)
            });
            resovle({pages: datas, source: chapter_source_url})
        }).then(err => reject(err));
    })
}

module.exports = NetTruyenChapter;