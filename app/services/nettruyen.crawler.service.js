const Crawler = require('crawler');
const Category = require("../models/category.model.js");
const Ebook = require("../models/ebook.model.js");
const Chapter = require("../models/chapter.model.js");

const TimTruyenPage = require("../nettruyen/timtruyen.page");
const NetTruyenEbook = require("../nettruyen/nettruyen.ebook");
const Helper = require("../helper/helper.js");
const { data } = require('cheerio/lib/api/attributes');

const nettruyen = function () { };

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
    NetTruyenEbook.CrawlerListEbook(url).then(data => {
        result(null, data);
    }).catch(err => {
        result(err, null)
    })
}

nettruyen.CrawlEbookChapterByCategory = (url, fromIndex, toIndex, result) => {
    NetTruyenEbook.CrawlEbookChapterByCategory(url, fromIndex, toIndex).then(data => {
        result(null, data);
    }).catch(err => {
        result(err, null)
    })
}

nettruyen.CrawlAllNetTruyen = (result) => {
    Category.getAll((err, datas) => {
        if(err)
           result(err, null)
        else {
           if(datas) {
            let promises = datas.map(data => {
                return new Promise((resovle, reject) => {
                    NetTruyenEbook.CrawlEbookChapterByCategory(data.Source).then(data => {
                        resovle(data);
                    }).catch(err => {
                        reject(err);
                    })
                })
            })
            Promise.all(promises).then(result =>{
                result(null, result);
            }).catch(err => {
                result(err, null)
            })
           }
        }
    }) 
}


module.exports = nettruyen;