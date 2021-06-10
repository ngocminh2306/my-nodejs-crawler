const sql = require("./db.js");

// constructor
const EbookDetail = function (ebookDetail) {
    this.title = ebookDetail.title;
    this.imageUrl = ebookDetail.imageUrl;
    this.content = ebookDetail.content;
    this.author = ebookDetail.author;
    this.cates = ebookDetail.cates;
    this.view = ebookDetail.view;
    this.rate = ebookDetail.rate;
    this.slug = ebookDetail.slug;
    this.orther_name = ebookDetail.orther_name;
    this.status_str = ebookDetail.status_str;
    this.chapters = ebookDetail.chapters? ebookDetail.chapters: [];
};

EbookDetail.create = (newEbook, result) => {
    sql.query("INSERT INTO ebook_detail SET ?", newEbook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created EbookDetail: ", { id: res.insertId, ...newEbook });
        result(null, { id: res.insertId, ...newEbook });
    });
};

EbookDetail.findById = (ebookId, result) => {
    sql.query(`SELECT * FROM ebook_detail WHERE id = ${ebookId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found EbookDetail: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found EbookDetail with the id
        result({ kind: "not_found" }, null);
    });
};

EbookDetail.findByRangeId = (fromId, toId, result) => {
    sql.query(`SELECT * FROM ebook_detail WHERE id >= ${fromId} && id <= ${toId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found: ", res);
            result(null, res);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};


EbookDetail.findByKeyWord = (keyword, result) => {
    sql.query(`SELECT * FROM ebook_detail WHERE slug = '${keyword}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found category: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

EbookDetail.getAll = result => {
    sql.query("SELECT * FROM ebook_detail", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("ebook_detail: ", res);
        result(null, res);
    });
};

EbookDetail.updateById = (id, ebookDetail, result) => {
    sql.query(
        "UPDATE ebook_detail SET title = ?, imageUrl = ?, content = ?, author = ?, cates = ?, view = ?, rate = ?, slug = ?, orther_name = ?, status_str = ? WHERE id = ?",
        [ebookDetail.title, ebookDetail.imageUrl, ebookDetail.content, ebookDetail.author, ebookDetail.cates, ebookDetail.view, ebookDetail.rate, ebookDetail.slug, ebookDetail.orther_name, ebookDetail.status_str, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found EbookDetail with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated EbookDetail: ", { id: id, ...EbookDetail });
            result(null, { id: id, ...EbookDetail });
        }
    );
};

EbookDetail.remove = (id, result) => {
    sql.query("DELETE FROM ebook_detail WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found EbookDetail with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted EbookDetail with id: ", id);
        result(null, res);
    });
};

module.exports = EbookDetail;