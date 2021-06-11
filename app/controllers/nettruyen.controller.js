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
