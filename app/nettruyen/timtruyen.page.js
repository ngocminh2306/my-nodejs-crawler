const Category = require("../models/category.model.js");
const NetTruyenHome = require('./common.crawler');
const TimTruyenPage = function () {

};
TimTruyenPage.FindAllMegaMenu = (url) => {
    return new Promise((resolve, reject) => {
        NetTruyenHome.LoadPage(url).then(res => {
            const $ = res;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            let lstCategory = [];
            $($('.dropdown-menu.megamenu')[0]).find("li").each((i, e) => {
                let description = $(e).find('a').attr('data-title')
                let url = $(e).find('a').attr('href')
                let name = $(e).find('a').attr('title') ? $(e).find('a').attr('title') : $(e).find('a strong').text()
                let slug = '';
                if (url) {
                    slug = url.split('/').pop()
                }
                let category = new Category({
                    name: name,
                    slug: slug,
                    description: description,
                    source: url,
                    pageCount: 1
                })
                lstCategory.push(category);
            })
            let promises = lstCategory.map(category => {
                return new Promise((resolve1, reject1) => {
                    TimTruyenPage.FindPageCount(url).then(pageCount => {
                        let newCategory = new Category({
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            source: category.url,
                            pageCount: pageCount
                        })
                        resolve1(newCategory)
                    }).then(err => { reject1(err) })
                })
            });

            Promise.all(promises).then((values) => {
                console.log(values)
                resolve(values)
            }).catch(err => {
                console.log(err)
                reject(err)
            });
        }).catch(error => {
            reject(error)
        })
    })
}
/**
 * Tim số trang trong 1 thể loại truyện
 */
TimTruyenPage.FindPageCount = (url) => {
    return new Promise((resolve, reject) => {
        NetTruyenHome.LoadPage(url).then(res => {
            const $ = res;
            let pageCount = 0;
            let el = $(".pagination li a[title='Trang cuối']").attr('href');
            if (el) {
                if (el.split('=')) {
                    pageCount = Number(el.split('=').pop())
                } else {
                    pageCount = 1;
                }
            }
            resolve(pageCount)
        }).catch(error => {
            reject(error)
        })
    })
}
function mapObjectToArray(obj, cb) {
    var res = [];
    for (var key in obj)
        res.push(cb(obj[key], key));
    return res;
}
module.exports = TimTruyenPage;