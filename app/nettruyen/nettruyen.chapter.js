const CommonCrawler = require('../helper/common.crawler');
const Chapter = require("../models/chapter.model.js");
const NetTruyenChapter = function () { };

NetTruyenChapter.CrawlerChapter = (chapter_source_url) => {
    return new Promise((resovle, reject) => {
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
NetTruyenChapter.SaveOrEditChapter = (chapter) => {
    return new Promise((resovle, reject) => {
        Chapter.findByDataId(chapter.data_id, (err, data) =>{
            if(err)
                reject(err)
            else {
                //Đã có chapter trung data_id thì update
                if(data) {
                    Chapter.updateById(data.Id, chapter, (_err,_data) =>{
                        if(_err)
                            reject(_err)
                        else 
                            resovle(_data)
                    })
                }else { //chưa có thì thêm mới
                    Chapter.create(chapter, (_err,_data) =>{
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

NetTruyenChapter.SaveOrEditChapters = (chapters) => {
    return new Promise((resovle, reject) => {
        let promises = [];
        promises =chapters.map(chapter => {
            return new Promise((_resovle, _reject) => {
                NetTruyenChapter.SaveOrEditChapter(chapter).then(data => _resovle(data)).catch(err => _reject(err));
            })
        })
        Promise.all(promises).then(data => resovle(data)).catch(err => reject(err));
    })
}

module.exports = NetTruyenChapter;