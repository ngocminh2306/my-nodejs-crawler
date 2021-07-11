const CommonCrawler = require('../helper/common.crawler');
const TextChapter = require("../models/text-chapter.model");
const CrawlerLog = require("../models/crawler.log.model");
const TextEbook = require("../models/text-ebook.model");
const Helper = require("../helper/helper.js");

const DTruyenChapter = function () { };

DTruyenChapter.CrawlerChapterOnly = (ebook_source_url) => {
    return new Promise((resovleAll, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            let $ =res;
            let slugEbookArray = ebook_source_url.split('/');
            let ebookSlug =  slugEbookArray[slugEbookArray.length - 3];
            
            console.log('Tìm được Ebooks!')
            let lstChapter = [];
            $("#chapters .chapters li").each((i, e) => {
                let source, slugArray, slug, dataId;
                let name, update_time_str, view, ebook_id;

                source = $(e).find('a').attr('href');
                slugArray = source.split('/');
                let a = slugArray[slugArray.length - 1].split('.');
                let slugStr = a[0].split('_');
                slug = slugStr[0]
                dataId = slugStr[1];
                name = $(e).find('a').text();

                let chapter = new TextChapter({
                    name: name,
                    source: source,
                    slug: slug,
                    data_id: dataId,
                    ebook_slug: ebookSlug
                })
                
                lstChapter.push(chapter);
            })
            let promises = lstChapter.map(v => {
                return new Promise((resovle1, reject1) => {
                    if(v.Source) {
                        DTruyenChapter.CrawlerChapter(v.Source).then(res => {
                            resovle1(res)
                        }).catch(err => reject1(err));
                    }else{
                        resovle1({err: 'Source NULL'})
                    }
                })
            })
            Promise.all(promises).then(data =>{
                data.map((v,i) => {
                    let index = lstChapter.findIndex(x=>x.Source == v.source);
                    // console.log(v)
                    lstChapter[index].Content = v.pages;  
                    lstChapter[index].UpdateTimeStr = v.update_time_str;            
                })
                console.log('Tìm được lstChapter!')
                console.log(lstChapter.length);
                //Insert ebook
                resovleAll(lstChapter)
            }).catch(err => reject(err))
        })
    })
}
//Thu nghiem quee la array
DTruyenChapter.CrawlerChapterOnly2 = (ebook_source_url) => {
    return new Promise((resovleAll, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            let $ =res;
            let slugEbookArray = ebook_source_url.split('/');
            let ebookSlug =  slugEbookArray[slugEbookArray.length - 3];
            
            console.log('Tìm được Ebooks!')
            let lstChapter = [];
            $("#chapters .chapters li").each((i, e) => {
                let source, slugArray, slug, dataId;
                let name, update_time_str, view, ebook_id;

                source = $(e).find('a').attr('href');
                slugArray = source.split('/');
                let a = slugArray[slugArray.length - 1].split('.');
                let slugStr = a[0].split('_');
                slug = slugStr[0]
                dataId = slugStr[1];
                name = $(e).find('a').text();

                let chapter = new TextChapter({
                    name: name,
                    source: source,
                    slug: slug,
                    data_id: dataId,
                    ebook_slug: ebookSlug
                })
                
                lstChapter.push(chapter);
            })
            let urls = lstChapter.map(v => v.Source);
            DTruyenChapter.CrawlerChapter2(urls).then(res => {
                console.log(res)
            }).catch(err => reject(err));

            // let promises = lstChapter.map(v => {
            //     return new Promise((resovle1, reject1) => {
            //         if(v.Source) {
            //             DTruyenChapter.CrawlerChapter2(v.Source).then(res => {
            //                 resovle1(res)
            //             }).catch(err => reject1(err));
            //         }else{
            //             resovle1({err: 'Source NULL'})
            //         }
            //     })
            // })
            // Promise.all(promises).then(data =>{
            //     data.map((v,i) => {
            //         let index = lstChapter.findIndex(x=>x.Source == v.source);
            //         lstChapter[index].Content = v.pages;  
            //         lstChapter[index].UpdateTimeStr = v.update_time_str;            
            //     })
            //     console.log('Tìm được lstChapter!')
            //     console.log(lstChapter.length);
            //     resovleAll(lstChapter)
            // }).catch(err => reject(err))
        })
    })
}

DTruyenChapter.CrawlerChapter = (chapter_source_url) => {

    return new Promise((resovle, reject) => {
        // console.log('crawle chapter :' + chapter_source_url)
            CommonCrawler.LoadPage(chapter_source_url).then(res => {
                let $ = res;
                $('#chapter-content .wt-ads2').remove();
                $('#chapter-content div').remove();
                let datas = $('#chapter-content').html();
                let update_time_str = '';
                $('#chapter header p').each((i, e) => {
                    if(i == 2) {
                        update_time_str = $(e).text().trim();
                    }
                })
                resovle({pages: datas, source: chapter_source_url, update_time_str: update_time_str})
            }).then(err => reject(err));
    })
}
DTruyenChapter.CrawlerChapter2 = (urls) => {
    return new Promise((resovle, reject) => {
        CommonCrawler.LoadPages(urls).then(ress => {
            console.log(ress.length)
            let promises = ress.map(res => {
                return new Promise((_resovle, _reject) => {
                    // console.log('crawle chapter :' + chapter_source_url)
                    let $ = res;
                    $('#chapter-content .wt-ads2').remove();
                    $('#chapter-content div').remove();
                    let datas = $('#chapter-content').html();
                    let update_time_str = '';
                    $('#chapter header p').each((i, e) => {
                        if(i == 2) {
                            update_time_str = $(e).text().trim();
                        }
                    })
                    _resovle({pages: datas, source: urls[res.urlIndex], update_time_str: update_time_str})
                })
            })
            Promise.all(promises).then(data => {
                console.log("QWqweqwe:" + data)
                resovle(data);
            }).catch(err => {})
        }).then(err => reject(err));
    })
}
DTruyenChapter.SaveOrEditChapter = (chapter) => {
    return new Promise((resovle, reject) => {
        TextChapter.findByDataId(chapter.DataId, (err, data) =>{
            if(err)
                reject(err)
            else {
                if(data) {
                    TextChapter.updateById(data.Id, chapter, (_err,_data) =>{
                        if(_err)
                            reject(_err)
                        else 
                            resovle(_data)
                    })
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
                if(chapter && chapter.DataId && chapter.Name && chapter.UpdateTimeStr && chapter.Content && chapter.EbookSlug)
                {
                    DTruyenChapter.SaveOrEditChapter(chapter).then(data => _resovle(data)).catch(err => _reject(err));
                }else {
                    console.log("TextChapter Invalid!")
                    _resovle("TextChapter Invalid!")
                }
            })
        })
        Promise.all(promises).then(data => resovle(data)).catch(err => reject(err));
    })
}

DTruyenChapter.CrawlAndSaveChapter = (ebook_source_url) =>{
    return new Promise((resovleAll, reject) => {
        let promises = [];
        DTruyenChapter.CrawlerChapterOnly(ebook_source_url).then(lstChapter =>{
            DTruyenChapter.SaveOrEditChapters(lstChapter).then(data => {
                // console.log('NetTruyenEbook.SaveOrEditEbook done!')
                // CrawlerLog.create(new CrawlerLog({
                //     Type: 2,
                //     EntityOrClassName: 'TextChapter',
                //     Title: ebook_source_url,
                //     Note: lstChapter.length + ' chapter - page index: ' + pageIndex
                // }), (err, data) => {

                // })
                console.log('--------SaveOrEditChapters--------');
                 resovleAll(data)})
            .catch(err => reject(err))
        }).catch(err => reject(err))
    })
}
DTruyenChapter.CrawlAndSaveChapter2 = (ebook_source_url) =>{
    return new Promise((resovleAll, reject) => {
        let promises = [];
        DTruyenChapter.CrawlerChapterOnly2(ebook_source_url).then(lstChapter =>{
            // DTruyenChapter.SaveOrEditChapters(lstChapter).then(data => {
            //     console.log('--------SaveOrEditChapters--------');
            //      resovleAll(data)})
            // .catch(err => reject(err))
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