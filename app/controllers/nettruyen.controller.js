const nettruyen = require("../services/nettruyen.crawler.service.js");

exports.crawlerCategory = (req, res) => {
    nettruyen.crawlerCategory((err, data) => {
        if (err) {
            console.log('my err: ',err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving crawler."
            });
        }
        else {
            res.send(data);
        }
    })
};

exports.crawlerEbookBySource = (req, res) => {
    nettruyen.crawler_ebook_by_source('http://www.nettruyentop.com/truyen-tranh/cau-lac-bo-nhung-ke-mat-ngu-30721', (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};

exports.crawlerEbook = (req, res) => {
    if(!req.query.cateId){
        res.status(500).send({
            message: "no query params cateId."
        });
    }else{
        nettruyen.crawlerEbook(req.query.cateId, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            else res.send(data);
        })
    }
};
exports.crawlerEbookDetail = (req, res) => {
    if(!req.query.fromId || !req.query.toId){
        res.status(500).send({
            message: "no query params fromId, toId."
        });
    }else{
        nettruyen.crawlerEbookDetail(req.query.fromId, req.query.toId, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            else res.send(data);
        })
    }
};

exports.crawlerChapterDetail = (req, res) => {
    if(!req.query.fromId || !req.query.toId){
        res.status(500).send({
            message: "no query params fromId, toId."
        });
    }else{
        nettruyen.crawlerChapterDetail(req.query.fromId, req.query.toId, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            else res.send(data);
        })
    }
};