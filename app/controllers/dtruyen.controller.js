const DtruyenPage = require("../_dtruyen/dtruyen.page");

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