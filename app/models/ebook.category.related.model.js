const sql = require("./db.js");

// constructor
const EbookCategoryRelated = function (ebookCategoryRelated) {
    this.EbookCategoryId = ebookCategoryRelated.EbookCategoryId;
    this.EbookId = ebookCategoryRelated.EbookId;
    this.Type = ebookCategoryRelated.Type?ebookCategoryRelated.Type:0;
};

EbookCategoryRelated.create = (newEbookCategoryRelated, result) => {
    sql.query("INSERT INTO EbookCategoryRelated SET ?", newEbookCategoryRelated, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { Id: res.insertId, ...newEbookCategoryRelated, CrawlerStatus: 'Create'  });
    });
};


EbookCategoryRelated.findIsExits = (ebookId, cateId, result) => {
    sql.query(`SELECT * FROM EbookCategoryRelated WHERE EbookCategoryId = ${cateId} AND EbookId = ${ebookId} AND Type = 0`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res[0]);
            return;
        }

        // not found Ebook with the id
        result(null, null);
    });
};
EbookCategoryRelated.findIsTextEbookExits = (ebookId, cateId, result) => {
    sql.query(`SELECT * FROM EbookCategoryRelated WHERE EbookCategoryId = ${cateId} AND EbookId = ${ebookId} AND Type = 1`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res[0]);
            return;
        }

        // not found Ebook with the id
        result(null, null);
    });
};
module.exports =  EbookCategoryRelated