const Category = require("../models/category.model.js");
const CommonCrawler = require('../helper/common.crawler');
const DTruyenPage = function () { };
DTruyenPage.FindAllMegaMenu = (url) => {
    return new Promise((resolveAll, rejectAll) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let lstCategory = [];
            
            $('.main-nav li').each((index, el) => {
                if(index == 0) {
                    $(el).find("ul li").each((i, e) => {
                        if(i > 1) {
                            let description = $(e).find('a').attr('title')
                            let url = $(e).find('a').attr('href')
                            let name = $(e).find('a i').end().text()
                            let slug = '';
                            if (url) {
                                let array = url.split('/');
                                slug = array[array.length - 2];
                            }
                            let category = new Category({
                                name: name,
                                slug: slug,
                                description: description,
                                source: url,
                                pageCount: 1,
                                Type: 1
                            })
                            lstCategory.push(category);
                        }
                    })
                }
            })
            let promises = lstCategory.map(category => {
                return new Promise((resolve1, reject1) => {
                    DTruyenPage.FindPageCount(category.Source).then(pageCount => {
                        let newCategory = new Category({
                            name: category.Name,
                            slug: category.Slug,
                            description: category.Description,
                            source: category.Source,
                            pageCount: pageCount,
                            Type: 1
                        })
                        resolve1(newCategory)
                    }).then(err => { reject1(err) })
                })
            });

            Promise.all(promises).then((values) => {
                let promises2 = values.map(value => {
                    return new Promise((resolve2, reject2) => {
                        Category.CreateOrUpdate(value).then(data => {
                            resolve2(data);
                        }).catch(err => { reject2(err) })
                    })
                })
                Promise.all(promises2).then(datas => {
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
 DTruyenPage.FindPageCount = (url) => {
    return new Promise((resolve, reject) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let text = $(".pagination-control ul.pagination li.dot").next().find('a').text();
            let text2 = 0;
            $(".pagination-control ul.pagination li").each((i,e) => {
                if(i ==3) {
                    text2 = $(e).find('a').text();
                }
            })
            console.log(text);
            console.log(text2);
            let pageCount = Number(text)?Number(text2):0;
            console.log('PageCount: ' + pageCount);
            if(!pageCount) 
                pageCount = 1;
            // if (el) {
            //     if (el.split('=')) {
            //         pageCount = Number(el.split('=').pop())
            //     } else {
            //         pageCount = 1;
            //     }
            // }
            resolve(pageCount)
        }).catch(error => {
            reject(error)
        })
    })
}
module.exports = DTruyenPage;