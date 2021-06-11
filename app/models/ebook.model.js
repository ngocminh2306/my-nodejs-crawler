const sql = require("./db.js");

// constructor
const Ebook = function (ebook) {
    this.title = ebook.title;
    this.imageUrl = ebook.imageUrl;
    this.content = ebook.content;
    this.author = ebook.author;
    this.cates = ebook.cates;
    this.view = ebook.view;
    this.rate = ebook.rate;
    this.slug = ebook.slug;
    this.orther_name = ebook.orther_name;
    this.status_str = ebook.status_str;
    this.chapters = ebook.chapters? ebookDetail.chapters: [];
};

Ebook.create = (newEbook, result) => {
    let ebook = newEbook;
    delete ebook.chapters;
    console.log(ebook)
    sql.query("INSERT INTO Ebooks SET ?, CreationTime = now()", ebook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created Ebook: ", { id: res.insertId, ...ebook });
        result(null, { id: res.insertId, ...ebook });
    });
};

Ebook.findById = (ebookId, result) => {
    sql.query(`SELECT * FROM Ebooks WHERE Id = ${ebookId}`, (err, res) => {
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

Ebook.findByKeyWord = (keyword, result) => {
    sql.query(`SELECT * FROM Ebooks WHERE Slug = '${keyword}'`, (err, res) => {
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
        result(null, null);
    });
};

Ebook.getAll = result => {
    sql.query("SELECT * FROM Ebooks", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Ebook.updateById = (id, ebook, result) => {
    sql.query(
        "UPDATE Ebooks SET title = ?, alt = ?, source = ?, imageUrl = ?, originImageUrl = ?, view = ?, slug = ?, page = ?, content = ?, author = ?, cates = ?, status_str = ?, orther_name = ? CrawlerDate = now() WHERE Id = ?",
        [ebook.title, ebook.alt, ebook.source, ebook.imageUrl, ebook.originImageUrl, ebook.view, ebook.slug, ebook.page, ebook.content, ebook.author, ebook.cates, ebook.status_str , ebook.orther_name, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Ebook with the id
                result({ kind: "ebook update not_found" }, null);
                return;
            }

            console.log("updated Ebook: ", { id: id, ...ebook });
            result(null, { id: id, ...ebook });
        }
    );
};

module.exports = Ebook;