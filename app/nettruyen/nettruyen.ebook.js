const CommonCrawler = require('../helper/common.crawler');
const Chapter = require("../models/chapter.model.js");
const Ebook = require("../models/ebook.model");
const Category = require("../models/category.model");
const CrawlerLog = require("../models/crawler.log.model")
const NetTruyenChapter = require("../nettruyen/nettruyen.chapter");
const TimTruyenPage = require("../nettruyen/timtruyen.page")

const NetTruyenEbook = function () { };

/**
 * Trả về kết quả tất cả ebook và chapter của category đó
 * @param {url category trang nguồn để crawl tất cả ebook của cate đó} url 
 * @returns 
 */
NetTruyenEbook.CrawlEbookChapterByCategory = (url, fromIndex, toIndex) =>{
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
/**
 * Crawl Ebook dựa vào url và page index
 * @param {*} url 
 * @param {*} fromIndex 
 * @param {*} toIndex 
 */
NetTruyenEbook.CrawlEbookByCategory = (url, fromIndex, toIndex) =>{
    return new Promise((resovle, reject) => {
        NetTruyenEbook.CrawlerListEbook(url, fromIndex, toIndex).then(listEbookWillCrawl => {
            let promises = listEbookWillCrawl.map(ebookWillCrawl => {
                return new Promise((_resovle, _reject) => {
                    NetTruyenEbook.CrawlerEbookOnly(ebookWillCrawl.Source).then(Ebooks => {
                        _resovle(Ebooks);
                    }).catch(err => _reject(err));
                })
            })
            Promise.all(promises).then(ebooks =>{
                let _promises = ebooks.map(ebook => {
                    return new Promise((_resovle, _reject) => { 
                        NetTruyenEbook.SaveOrEditEbook(ebook).then(data => _resovle(data)).catch(err => _reject(err));
                    })
                })

                Promise.all(_promises).then(_data =>{
                    console.log('NetTruyenEbook.SaveOrEditEbook done!')
                    CrawlerLog.create(new CrawlerLog({
                        Type: 1,
                        EntityOrClassName: 'Ebook',
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
/**
 * Thêm mới hoặc cập nhât ebook
 * @param {*} ebook 
 */
NetTruyenEbook.SaveOrEditEbook = (ebook) => {
    return new Promise((resovle, reject) => {
        Ebook.findByKeyWord(ebook.Slug, (err, findEbook) =>{
            if(err)
                reject(err)
            else {
                //Nếu tìm được ebook bằng slug thì update
                if(findEbook) {
                    console.log('Update ebook: ', ebook.Slug)
                   Ebook.updateById(findEbook.Id, ebook, (_err, _data) => {
                        if(_err)
                            reject(err);
                        else 
                            resovle(_data);
                    })
                } //không tìm được thì tạo mới
                else {
                    console.log('Create ebook: ', ebook.Slug)
                    Ebook.create(ebook, (_err, _data) => {
                        if(_err)
                            reject(err);
                        else 
                            resovle(_data);
                    })
                }
            }
        })
    })
}

/**
 * Luu Ebook va chapter
 * @param {*} url 
 * @returns 
 */
 NetTruyenEbook.SaveEbookAndChapters = (ebook) =>{
     let chapters = ebook.chapters;
    return new Promise((resovle, reject) => {
        NetTruyenEbook.SaveOrEditEbook(ebook).then(data => {
            NetTruyenChapter.SaveOrEditChapters(chapters).then(_data =>{
                resovle({message: 'update or create success!'})
            }).then(_err => reject(_err))
        }).catch(err => reject(err))
    })
 }

/**
 * Lấy danh sách ebook để chuẩn bị crawl ebook
 */
NetTruyenEbook.CrawlerListEbook = (url, fromIndex, toIndex) =>{
    return new Promise((resovleAll, reject) => {

        TimTruyenPage.FindPageCount(url).then(pageCount => {
            let promises = [];
            if(!fromIndex) fromIndex = 1;
            else {
                if(fromIndex > pageCount) {
                    toIndex = pageCount;
                }
            }
            if(!toIndex) 
                toIndex = pageCount;
            else {
                if(toIndex > pageCount) {
                    toIndex = pageCount;
                }
            }
            for(let page = fromIndex; page <= toIndex; page++) {
                console.log('Crawl page index: ' + page)
                let p = new Promise((_resovle, _reject) => {
                    let crawlerUrl = url+'?page='+ page;
                    console.log('Crawl url: ' + crawlerUrl)
                    CommonCrawler.LoadPage(crawlerUrl).then(res => {
                        const $ = res;
                        let items = [];
                        $('.ModuleContent .items .row .item').each((i, e) => {
                            let source = $(e).find('.jtip').attr('href');
                            let name = $(e).find('.jtip').text();
                            let slug = $(e).find('.jtip').attr('href').split('/').pop();
                            items.push({Source: source, Name: name, Slug: slug, PageIndex: page,CrawlUrl: crawlerUrl});
                        })
                        _resovle(items);
                    }).catch(err => _reject(err));
                })
                promises.push(p);
            }
            Promise.all(promises).then(datas => {
                let myDatas = []
                datas.map(values => {
                    values.map( v => {
                        myDatas.push(v);
                    })
                })
                resovleAll(myDatas);

            }).catch(err =>reject(err))

        }).catch(err => reject(err))
    })
}
/**
 * Crawl ebook trả về thông tin Ebook và chapter
 * @param 
 * @returns  Ebook và chapter
 */
NetTruyenEbook.CrawlerEbook = (ebook_source_url) => {
    return new Promise((resovleAll, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            let $ = res;
            let title = $('#item-detail .title-detail').text();
            let imageUrl = $('#item-detail .detail-info img').attr('src');
            let content = $('#item-detail .detail-content p').text();
            let author = $('#item-detail .detail-info .author a').text();
            let cates = $('#item-detail .detail-info .list-info .kind .col-xs-8').text();
            let slugEbookArray = ebook_source_url.split('/');
            let ebookSlug =  slugEbookArray[slugEbookArray.length - 1];
            
            let view = 0
            $('#item-detail .detail-info .list-info .row .col-xs-8').each((i, e) => {
                if (i == 4) {
                    view = Number($(e).text().replace('.',''));
                }
            })
            let rate = Number($("#item-detail .col-info span[itemprop='ratingValue']").text());
            let orther_name = $('#item-detail .detail-info h2.other-name').text();
            let status_str = $('#item-detail .detail-info .list-info .status p.col-xs-8').text();
            let Ebooks = new Ebook({
                title: title,
                imageUrl: imageUrl,
                content: content,
                orther_name: orther_name,
                author: author,
                cates: cates,
                view: view,
                rate: rate,
                status_str: status_str,
                slug: ebookSlug,
                source: ebook_source_url
            })
            console.log('Tìm được Ebooks!')
            // console.log(Ebooks)
            let lstChapter = [];
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
                        view = Number($(e).text().replace('.',''));
                    }
                })
                let chapter = new Chapter({
                    name: name,
                    source: source,
                    update_time_str: update_time_str,
                    view: view,
                    source: source,
                    slug: slug,
                    data_id: dataId,
                    ebook_slug: ebookSlug
                })
                lstChapter.push(chapter);
            })
            let promises = lstChapter.map(v => {
                // console.log(v)
                return new Promise((resovle1, reject1) => {
                    console.log('CrawlerChapter !' )
                    NetTruyenChapter.CrawlerChapter(v.Source).then(res => {
                        resovle1(res)
                    }).catch(err => reject1(err));
                })
            })
            Promise.all(promises).then(data =>{
                data.map((v,i) => {
                    // console.log('v.source: ',v.source);
                    // console.log('----lstChapter----: ',lstChapter);
                    let index = lstChapter.findIndex(x=>x.Source == v.source);
                    // console.log('lstChapter[index]: ',index);
                    lstChapter[index].Content = v.pages.toString();            
                })
                console.log('Tìm được lstChapter!')
                Ebooks.chapters = lstChapter;
                //Insert ebook
                resovleAll(Ebooks)
            }).catch(err => reject(err))

        }).catch(err => reject(err));
    })
}
/**
 * Chỉ crawl Ebook không clraw chatper 
 */
NetTruyenEbook.CrawlerEbookOnly = (ebook_source_url) => {
    return new Promise((resovleAll, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            let $ = res;
            let title = $('#item-detail .title-detail').text();
            let imageUrl = $('#item-detail .detail-info img').attr('src');
            let content = $('#item-detail .detail-content p').text();
            let author = $('#item-detail .detail-info .author a').text();
            let cates = $('#item-detail .detail-info .list-info .kind .col-xs-8').text();
            let slugEbookArray = ebook_source_url.split('/');
            let ebookSlug =  slugEbookArray[slugEbookArray.length - 1];
            
            let view = 0
            $('#item-detail .detail-info .list-info .row .col-xs-8').each((i, e) => {
                if (i == 4) {
                    view = Number($(e).text().replace('.',''));
                }
            })
            let rate = Number($("#item-detail .col-info span[itemprop='ratingValue']").text());
            let orther_name = $('#item-detail .detail-info h2.other-name').text();
            let status_str = $('#item-detail .detail-info .list-info .status p.col-xs-8').text();
            let Ebooks = new Ebook({
                title: title,
                imageUrl: imageUrl,
                content: content,
                orther_name: orther_name,
                author: author,
                cates: cates,
                view: view,
                rate: rate,
                status_str: status_str,
                slug: ebookSlug,
                source: ebook_source_url
            })
            console.log('Tìm được Ebooks!')
            resovleAll(Ebooks);
        }).catch(err => reject(err));
    })
}
module.exports = NetTruyenEbook;