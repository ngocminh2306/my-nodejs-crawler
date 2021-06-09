const nettruyen = require("../services/nettruyen.crawler.service.js");

exports.crawler = (req, res) => {
    nettruyen.crawler((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else {
            console.log('err: ', err)
            res.send(data);
        }
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