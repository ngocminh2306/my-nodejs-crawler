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

exports.crawler_ebook_list = (req, res) => {
    nettruyen.crawler_ebook_list('http://www.nettruyentop.com/tim-truyen/gender-bender', (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};
//1. http://www.nettruyentop.com/tim-truyen/cooking (done)
//2. http://www.nettruyentop.com/tim-truyen/action (fail)
//3. http://www.nettruyentop.com/tim-truyen/truong-thanh (fail)
//4. http://www.nettruyentop.com/tim-truyen/live-action (done)
//5. http://www.nettruyentop.com/tim-truyen/truyen-scan (doing)
//
exports.CrawlEbookChapterByCategory = (req, res) => {
    let fromIndex = Number(req.query.fromIndex);
    let toIndex = Number(req.query.toIndex);
    let url = req.query.url;
    nettruyen.CrawlEbookChapterByCategory(url, fromIndex, toIndex, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};
exports.CrawlEbookByCategory = (req, res) => {
    let fromIndex = Number(req.query.fromIndex);
    let toIndex = Number(req.query.toIndex);
    let url = req.query.url;
    nettruyen.CrawlEbookByCategory(url, fromIndex, toIndex, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};
exports.CrawlAndSaveChapter = (req, res) => {
    let url = req.query.url;
    let pageIndex = req.query.index;
    nettruyen.CrawlAndSaveChapter(url, pageIndex, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};
exports.CrawlAllNetTruyen = (req, res) => {
    nettruyen.CrawlAllNetTruyen((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    })
};

exports.dowloadEbookImage= (req, res) =>{
    let url = req.query.url;
    let slug = req.query.slug;
    nettruyen.dowloadEbookImage(url, slug, (err, data) => {
        console.log(data)
        if (err) {
            console.log(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else res.send(data);
    })
};

exports.reCreateEbookCate= (req, res) =>{
    let cate = req.query.cate;
    let cate_id = req.query.cate_id;
    nettruyen.reCreateEbookCate(cate, cate_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else res.send(data);
    })
};
exports.DownloadChapterImage = (req, res) =>{
    let ebookSlug = req.query.slug;
    if(!ebookSlug) {
        res.status(500).send({
            message:
                err.message || "No Params."
        });
    }
    nettruyen.DownloadChapterImage(ebookSlug, (err, data) => {
        console.log(data)
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else res.send(data);
    })
};

exports.DownloadChapterImageFormListEbook = (req, res) => {
    nettruyen.DownloadChapterImageFormListEbook((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else res.send(data);
    })
}
exports.DownloadChapterImageByChapter = (req, res) =>{
    let dataId = req.query.dataid;
    console.log(dataId)
    if(!dataId) {
        res.status(500).send({
            message:
                err.message || "No Params."
        });
    }
    nettruyen.DownloadChapterImageByChapter(dataId, (err, data) => {
        console.log(data)
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        }
        else res.send(data);
    })
};

