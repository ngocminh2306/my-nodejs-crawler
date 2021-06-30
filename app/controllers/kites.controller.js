const Post = require("../models/post.model.js");
const Helper = require("../helper/helper.js");
const kitesService = require("../services/kites.crawler.service");

exports.CrawlerListPostController = (req, res) => {
    let url = req.query.url;
    kitesService.CrawlerListPostsService(url, (err, data) => {
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