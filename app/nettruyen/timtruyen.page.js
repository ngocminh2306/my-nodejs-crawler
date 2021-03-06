const Category = require("../models/category.model.js");
const CommonCrawler = require('../helper/common.crawler');
const TimTruyenPage = function () { };
TimTruyenPage.FindAllMegaMenu = (url) => {
    return new Promise((resolveAll, rejectAll) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let lstCategory = [];
            $($('.dropdown-menu.megamenu')[0]).find("ul li").each((i, e) => {
                console.log(i)
                if(i > 1) {
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
                        pageCount: 1,
                        Type: 0
                    })
                    console.log('category: ', category)
                    lstCategory.push(category);
                }
                console.log('Tìm được lstCategory!')
            })
            let promises = lstCategory.map(category => {
                return new Promise((resolve1, reject1) => {
                    TimTruyenPage.FindPageCount(category.Source).then(pageCount => {
                        let newCategory = new Category({
                            name: category.Name,
                            slug: category.Slug,
                            description: category.Description,
                            source: category.Source,
                            pageCount: pageCount,
                            Type: 0
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
            console.log('Tìm  PageCount!')
            const $ = res;
            let pageCount = 1;
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