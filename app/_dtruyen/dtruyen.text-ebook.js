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
    return new Promise((resovle, reject) => {
        NetTruyenEbook.CrawlerListEbook(url, fromIndex, toIndex).then(listEbookWillCrawl => {
            let promises = listEbookWillCrawl.map(ebookWillCrawl => {
                return new Promise((_resovle, _reject) => {
                    NetTruyenEbook.CrawlerEbook(ebookWillCrawl.Source).then(Ebooks => {
                        _resovle(Ebooks);
                    }).catch(err => _reject(err));
                })
            })
            Promise.all(promises).then(ebooks =>{
                let _promises = ebooks.map(ebook => {
                    return new Promise((_resovle, _reject) => { 
                        NetTruyenEbook.SaveEbookAndChapters(ebook).then(data => _resovle(data)).catch(err => _reject(err));
                    })
                })

                Promise.all(_promises).then(_data =>{
                    console.log('NetTruyenEbook.SaveEbookAndChapters done!')
                    CrawlerLog.create(new CrawlerLog({
                        Type: 1,
                        EntityOrClassName: 'Chapter, Ebook',
                        Title: url,
                        Note: `From: ${fromIndex} - To: ${toIndex}`
                    }), (err, data) => {

                    })
                    resovle(_data);
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })

            }).catch(err => reject(err))
        }).catch(err => reject(err));
    })
}

module.exports = DtruyenTextEbook;