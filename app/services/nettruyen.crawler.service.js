const Crawler = require('crawler');
const Category = require("../models/category.model.js");
const Ebook = require("../models/ebook.model.js");
const EbookDetail = require("../models/ebookDetail.model.js");
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
        // console.log('DATAAA: ',data)
        result(null, data);
    }).catch(err => {
        console.log("CO loi xay ra:::")
        result(err, null)
    })
}
nettruyen.crawlerEbook = (cateId, result) => {
    Category.findById(cateId, (err, data) => {
        if (err) {
            result(err, null);
        }
        else {

            for (let page = 1; page <= data.pageCount; page++) {
                let insertedObj = [];
                const c = new Crawler({
                    maxConnections: 10,
                    // This will be called for each crawled page
                    callback:
                        (error, res, done) => {
                            if (error) {
                                console.log(error);
                            } else {
                                let ebook;
                                const $ = res.$;
                                $('.ModuleContent .items .row .item').each((i, e) => {
                                    let source = $(e).find('.jtip').attr('href');
                                    let name = $(e).find('.jtip').text();
                                    let view = $(e).find('.image .pull-left').text().split(' ')[1].replace('.', '');
                                    view = Number(view);
                                    let imageUrl = $(e).find('.image img').attr('src');
                                    let orginImageUrl = $(e).find('.image img').attr('data-original');
                                    let slug = $(e).find('.jtip').attr('href').split('/').pop();

                                    //check item đã có chưa
                                    Ebook.findByKeyWord(slug, (err, data) => {
                                        if (!data || data.length == 0) {
                                            ebook = new Ebook({
                                                title: name,
                                                alt: name,
                                                source: source,
                                                imageUrl: imageUrl,
                                                originImageUrl: orginImageUrl,
                                                view: view,
                                                slug: slug,
                                                page: page
                                            })
                                            Ebook.create(ebook, (err, data) => {
                                                if (err)
                                                    console.log('Error');
                                                else
                                                    insertedObj.push(ebook);
                                            });
                                        }
                                    })
                                })
                            }
                            done();
                        }
                });
                // Queue just one URL, with default callback
                c.queue(data.source + '?page=' + page);
            }
        }
    })
}

nettruyen.crawlerEbookDetail = (fromId, toId, result) => {
    let ebookDetail;
    let insertedObj = [];
    Ebook.findByRangeId(fromId, toId, (err, data) => {
        if (err) {
            result(err, null);
        }
        else {
            data.forEach(element => {
                const c = new Crawler({
                    maxConnections: 10,
                    // This will be called for each crawled page
                    callback:
                        (error, res, done) => {
                            if (error) {
                                console.log(error);
                            } else {
                                const $ = res.$;
                                let title = $('#item-detail .title-detail').text();
                                let imageUrl = $('#item-detail .detail-info img').attr('src');
                                let content = $('#item-detail .detail-content p').text();
                                let author = $('#item-detail .detail-info .author a').text();
                                let cates = $('#item-detail .detail-info .list-info .kind .col-xs-8').text();
                                let view = element.view;
                                let rate = Number($("#item-detail .col-info span[itemprop='ratingValue']").text());
                                let orther_name = $('#item-detail .detail-info h2.other-name').text();
                                let status_str = $('#item-detail .detail-info .list-info .status p.col-xs-8').text();
                                let ebookDetail = new EbookDetail({
                                    title: title,
                                    imageUrl: imageUrl,
                                    content: content,
                                    orther_name: orther_name,
                                    author: author,
                                    cates: cates,
                                    view: view,
                                    rate: rate,
                                    status_str: status_str,
                                    slug: element.slug
                                })
                                EbookDetail.findByKeyWord(element.slug, (err, data2) => {
                                    if (!data2 || data2.length == 0) {
                                        EbookDetail.create(ebookDetail, (err, data) => {
                                            if (err)
                                                console.log('Error');
                                            else {
                                                insertedObj.push(ebookDetail);
                                            }

                                        });
                                    } else {
                                        $(".list-chapter ul li:not(.heading)").each((index, el) => {
                                            let source, slugArray, slug, dataId;
                                            let name, update_time_str, view, ebook_id;
                                            $(el).find('div').each((i, e) => {
                                                if (i == 0) {
                                                    source = $(e).find('a').attr('href');
                                                    slugArray = source.split('/');
                                                    slug = slugArray[slugArray.length - 2];
                                                    dataId = Number($(e).find('a').attr('data-id'));
                                                    name = $(e).find('a').text();
                                                }
                                                if (i == 1) {
                                                    update_time_str = $(e).text();
                                                }
                                                if (i == 2) {
                                                    view = Number($(e).text());
                                                }
                                            })
                                            Chapter.findByDataId(dataId, (err, data) => {
                                                if (err)
                                                    console.log(err);
                                                else {
                                                    if (!data) {
                                                        let chapter = new Chapter({
                                                            name: name,
                                                            source: source,
                                                            update_time_str: update_time_str,
                                                            view: view,
                                                            source: source,
                                                            slug: slug,
                                                            data_id: dataId,
                                                            ebook_id: data2.id
                                                        })
                                                        Chapter.create(chapter, (err, data) => {
                                                            if (err)
                                                                console.log('Error');
                                                            else {
                                                                insertedObj.push(ebookDetail);
                                                            }
                                                        })
                                                    } else {
                                                        let chapter = new Chapter({
                                                            name: name,
                                                            source: source,
                                                            update_time_str: update_time_str,
                                                            view: view,
                                                            source: source,
                                                            slug: slug,
                                                            data_id: dataId,
                                                            ebook_id: data2.id
                                                        })
                                                        Chapter.updateById(data.id, chapter, (err, data) => {
                                                            if (err)
                                                                console.log('Error');
                                                            else {
                                                                insertedObj.push(ebookDetail);
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                            done();
                        }
                });
                // Queue just one URL, with default callback
                c.queue(element.source);
                // result(null, insertedObj);
            });
        }
    })
}

//crawler chapter detail by find ebook fromId toId
nettruyen.crawlerChapterDetail = (fromId, toId, result) => {
    let chapterDetail;
    let insertedObj = [];
    EbookDetail.findByRangeId(fromId, toId, (err, data) => {
        if (err) {
            result(err, null);
        }
        else {
            data.forEach(element => {
                //fin chapter by ebook id
                Chapter.findByEBookId(element.id, (err, chapterItem) => {
                    if (chapterItem) {
                        chapterItem.forEach(cItem => {
                            const c = new Crawler({
                                maxConnections: 10,
                                // This will be called for each crawled page
                                callback:
                                    (error, res, done) => {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            const $ = res.$;
                                            ChapterDetail.findByDataId(cItem.data_id, (err, data2) => {
                                                if (!data2) {
                                                    let page = [];
                                                    $('.reading-detail.box_doc .page-chapter img').each((i, element) => {
                                                        let src = $(element).attr('src');
                                                        page.push('http:' + src)
                                                    });
                                                    let chapterDetail = new ChapterDetail({
                                                        data_id: cItem.data_id,
                                                        pages: page.toString()
                                                    })
                                                    ChapterDetail.create(chapterDetail, (err, data2) => {
                                                        if (err)
                                                            console.log('Error');
                                                        else
                                                            insertedObj.push(data2);
                                                    })
                                                    let res = [];
                                                    // Helper.downloadImage(page,`${cItem.data_id}`, (dir)=>{
                                                    //     res.push(dir)
                                                    //     let chapterDetail = new ChapterDetail({
                                                    //         data_id: cItem.data_id,
                                                    //         pages: res.toString()
                                                    //     })
                                                    //     ChapterDetail.create(chapterDetail, (err, data2) =>{
                                                    //         if (err)
                                                    //             console.log('Error');
                                                    //         else  
                                                    //             insertedObj.push(data2);
                                                    //     })
                                                    // })

                                                } else {
                                                    // update
                                                    let page = [];
                                                    $('.reading-detail.box_doc .page-chapter img').each((i, element) => {
                                                        let src = $(element).attr('src');
                                                        page.push('http:' + src)
                                                    });
                                                    let res = [];
                                                    let chapterDetail = new ChapterDetail({
                                                        data_id: cItem.data_id,
                                                        pages: page.toString()
                                                    })
                                                    ChapterDetail.create(chapterDetail, (err, data2) => {
                                                        if (err)
                                                            console.log('Error');
                                                        else
                                                            insertedObj.push(data2);
                                                    })
                                                }
                                            })
                                        }
                                        done();
                                    }
                            });
                            // Queue just one URL, with default callback
                            c.queue(cItem.source);
                        })
                    }
                })
            });
            result(null, insertedObj);
        }
    })
}

module.exports = nettruyen;