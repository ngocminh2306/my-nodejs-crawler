const DtruyenPage = require("../_dtruyen/dtruyen.page");
const DtruyenTextEbook = require("../_dtruyen/dtruyen.text-ebook");
const TextEbook = require("../models/text-ebook.model");
exports.crawlerCategory = (req, res) => {
    DtruyenPage.FindAllMegaMenu('https://dtruyen.com/').then(data => {
        res.send(data);
    }).catch(err => {
        console.log('my err: ',err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving crawler."
        });
    })
};

exports.CrawlEbookByCategory = (req, res) => {
    let fromIndex = Number(req.query.fromIndex);
    let toIndex = Number(req.query.toIndex);
    let url = req.query.url;
    DtruyenTextEbook.CrawlEbookByCategory(url, fromIndex, toIndex).then(data => {
        res.send(data);
    }).catch(err =>{
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving customers."
        });
    })
};
exports.ReCreateEbookCate= (req, res) =>{
    let cate = req.query.cate;
    let cate_id = req.query.cate_id;
    TextEbook.getAllRange((err, datas) => {
        if(err)
        {
            console.log(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else
        {
            console.log('datas', datas.length)
            if(datas && datas.length > 0) {
                let promises = [];
                promises = datas.map(data =>{
                    return DtruyenTextEbook.ReCreateEbookCate(cate,cate_id,data);
                })
                Promise.all(promises).then(_data =>{
                    res.send(_data);
                }).catch(_err => {
                    console.log(_err)
                    res.status(500).send({
                        message:
                            _err.message || "Some error occurred while retrieving customers."
                    });
                })
            }
        }
    })
};
