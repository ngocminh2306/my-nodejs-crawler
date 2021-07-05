const Crawler = require('crawler');
const Category = require("../models/category.model.js");
const Ebook = require("../models/ebook.model.js");
const Chapter = require("../models/chapter.model.js");
const EbookCategoryRelated = require("../models/ebook.category.related.model");

const KitesPage = require("../kites/kites.page");
const Helper = require("../helper/helper.js");

const kitesService = function () { };

kitesService.CrawlerListPostsService = (url, result) => {
    KitesPage.CrawlerListPosts(url).then(listposts => {
        console.log(listposts);
        let promises = listposts.map(value => {
            return new Promise((resovle, reject) => {
                
            })
        })
        result(null, listposts)
    }).catch(err => {
        result(err, null)
    })
}

module.exports = kitesService;