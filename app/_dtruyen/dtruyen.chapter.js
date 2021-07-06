const CommonCrawler = require('../helper/common.crawler');
const TextChapter = require("../models/text-chapter.model");
const CrawlerLog = require("../models/crawler.log.model");
const TextEbook = require("../models/text-ebook.model");
const Helper = require("../helper/helper.js");

const DTruyenChapter = function () { };

DTruyenChapter.CrawlerChapterOnly = (ebook_source_url) => {
    return new Promise((resovleAll, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            CommonCrawler.LoadPage(ebook_source_url).then(res => {
                let $ =res;
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
                let Ebooks = new TextEbook({
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
                    let chapter = new TextChapter({
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
                        // console.log('CrawlerChapter !' )
                        DTruyenChapter.CrawlerChapter(v.Source).then(res => {
                            resovle1(res)
                        }).catch(err => reject1(err));
                    })
                })
                Promise.all(promises).then(data =>{
                    data.map((v,i) => {
                        let index = lstChapter.findIndex(x=>x.Source == v.source);
                        lstChapter[index].Content = v.pages.toString();            
                    })
                    console.log('Tìm được lstChapter!')
                    //Insert ebook
                    resovleAll(lstChapter)
                }).catch(err => reject(err))
            })
        })
    })
}
DTruyenChapter.CrawlerChapter = (chapter_source_url) => {
    return new Promise((resovle, reject) => {
        // console.log('crawle chapter :' + chapter_source_url)
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
DTruyenChapter.SaveOrEditChapter = (chapter) => {
    return new Promise((resovle, reject) => {
        TextChapter.findByDataId(chapter.DataId, (err, data) =>{
            if(err)
                reject(err)
            else {
                //Đã có chapter trung data_id thì update
                if(data) {
                    // TextChapter.updateById(data.Id, chapter, (_err,_data) =>{
                    //     if(_err)
                    //         reject(_err)
                    //     else 
                    //         resovle(_data)
                    // })
                    resovle(data)
                }else { //chưa có thì thêm mới
                    TextChapter.create(chapter, (_err,_data) =>{
                        if(_err)
                            reject(_err)
                        else 
                            resovle(_data)
                    })
                }
            }
        })
    })
}

DTruyenChapter.SaveOrEditChapters = (chapters) => {
    return new Promise((resovle, reject) => {
        let promises = [];
        promises = chapters.map(chapter => {
            return new Promise((_resovle, _reject) => {
                DTruyenChapter.SaveOrEditChapter(chapter).then(data => _resovle(data)).catch(err => _reject(err));
            })
        })
        Promise.all(promises).then(data => resovle(data)).catch(err => reject(err));
    })
}

DTruyenChapter.CrawlAndSaveChapter = (ebook_source_url, pageIndex) =>{
    return new Promise((resovleAll, reject) => {
        let promises = [];
        DTruyenChapter.CrawlerChapterOnly(ebook_source_url).then(lstChapter =>{
            DTruyenChapter.SaveOrEditChapters(lstChapter).then(data => {
                // console.log('NetTruyenEbook.SaveOrEditEbook done!')
                CrawlerLog.create(new CrawlerLog({
                    Type: 2,
                    EntityOrClassName: 'TextChapter',
                    Title: ebook_source_url,
                    Note: lstChapter.length + ' chapter - page index: ' + pageIndex
                }), (err, data) => {

                })
                console.log('--------SaveOrEditChapters--------');
                 resovleAll(data)})
            .catch(err => reject(err))
        }).catch(err => reject(err))
    })
}
DTruyenChapter.DownloadChapterImage = (ebookSlug) =>{
    return new Promise((resovleAll, reject) => {
        TextChapter.getAllByEbookSlug(ebookSlug, (err, chapters) =>{
            if(err)
                reject(err)
            else {
                if(chapters && chapters.length > 0) {
                    let promises = chapters.map(chapter => {
                        return new Promise((_resovle, _reject) => {
                            if(!chapter.LocalContent) {
                                let urls = chapter.Content.split(',');
                                CommonCrawler.CrwalerRawImage(urls, chapter.DataId, (_err, _imagesStr) =>{
                                    if(_err)
                                    {
                                        console.log({mes: 'ERROR downloadChapterContent'})
                                        _resovle({err: 'downloadChapterContent'})
                                    }
                                    else {
                                        if(_imagesStr) {
                                            // console.log({ images: _imagesStr })
                                            //Luwu vao chapter
                                            TextChapter.updateLocalContent(chapter, _imagesStr.toString(), (__err, __data) => {
                                                if(__err)
                                                {
                                                    console.log({mes: 'ERROR updateLocalContent'})
                                                    _resovle({err: 'updateLocalContent'})
                                                }
                                                else {
                                                    console.log({mes: 'Tai xong updateLocalContent'})
                                                    // CrawlerLog.create(new CrawlerLog({
                                                    //     Type: 5,
                                                    //     EntityOrClassName: 'TextChapter',
                                                    //     Title: chapter.Code,
                                                    //     Note: `Tải ảnh thành công: ${chapter.DataId}`
                                                    // }), (err, data) => {
                                
                                                    // })
                                                    _resovle(__data);
                                                }
                                            })
                                        }
                                    }
                                })
                            }else {
                                _resovle({ mes: "TextChapter co anh LOCAL roi" });
                            }
                        })
                    })
                    Promise.all(promises).then(data => {
                        console.log({mes: 'Tai xong xong'})
                        resovleAll(data)
                    }).catch(err => {
                        console.log({mes: 'ERRor'})
                        reject(err)
                    })
                }
            }
       })
    })
}
DTruyenChapter.DownloadChapterImageByChapter = (dataId) =>{
    return new Promise((resovleAll, reject) => {
        TextChapter.findByDataId(dataId, (err, chapter) =>{
            if(err)
                reject(err)
            else {
                
                console.log('DownloadChapterImageByChapter: 1', dataId)
                if(chapter) {
                    if(!chapter.LocalContent) {
                        console.log('DownloadChapterImageByChapter: 2', dataId)
                        let urls = chapter.Content.split(',');
                        CommonCrawler.CrwalerRawImage(urls, chapter.DataId, (_err, _imagesStr) =>{
                            if(_err)
                            {
                                console.log({mes: 'ERROR downloadChapterContent'})
                                resovleAll({err: 'downloadChapterContent'})
                            }
                            else {
                                if(_imagesStr) {
                                    // console.log({ images: _imagesStr })
                                    //Luwu vao chapter
                                    TextChapter.updateLocalContent(chapter, _imagesStr.toString(), (__err, __data) => {
                                        if(__err)
                                        {
                                            console.log({mes: __err})
                                            resovleAll({err: 'updateLocalContent'})
                                        }
                                        else {
                                            console.log({mes: 'Tai xong updateLocalContent'})
                                            // CrawlerLog.create(new CrawlerLog({
                                            //     Type: 5,
                                            //     EntityOrClassName: 'TextChapter',
                                            //     Title: chapter.Code,
                                            //     Note: `Tải ảnh thành công: ${chapter.DataId}`
                                            // }), (err, data) => {
                        
                                            // })
                                            resovleAll(__data);
                                        }
                                    })
                                }
                            }
                        })
                    }else {
                        resovleAll({ mes: "TextChapter co anh LOCAL roi" });
                    }
                }
            }
       })
    })
}
module.exports = DTruyenChapter;