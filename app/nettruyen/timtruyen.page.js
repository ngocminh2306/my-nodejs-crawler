const { data } = require("cheerio/lib/api/attributes");
const Category = require("../models/category.model.js");
const CommonCrawler = require('./common.crawler');
const TimTruyenPage = function () { };
TimTruyenPage.FindAllMegaMenu = (url) => {
    return new Promise((resolveAll, rejectAll) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
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
                    TimTruyenPage.FindPageCount(category.source).then(pageCount => {
                        let newCategory = new Category({
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            source: category.source,
                            pageCount: pageCount
                        })
                        resolve1(newCategory)
                    }).then(err => { reject1(err) })
                })
            });

            Promise.all(promises).then((values) => {
                let promises = values.map(value => {
                    return new Promise((resolve2, reject2) => {
                        Category.CreateOrUpdate(value).then(data => {
                            resolve2(data);
                        }).catch(err => { reject2(err) })
                    })
                })
                Promise.all(promises).then(datas => {
                    resolveAll(datas)
                }).catch(err => {
                    rejectAll(err)
                });

            }).catch(err => {
                reject(err)
            });
        }).catch(error => {
            rejectAll(error)
        });
    })
}
/**
 * Tim số trang trong 1 thể loại truyện
 */
TimTruyenPage.FindPageCount = (url) => {
    return new Promise((resolve, reject) => {
        CommonCrawler.LoadPage(url).then(res => {
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
module.exports = TimTruyenPage;