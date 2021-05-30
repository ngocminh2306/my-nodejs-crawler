const sql = require("./db.js");

// constructor
const Ebook = function (ebook) {
    this.title = ebook.title;
    this.alt = ebook.alt;
    this.source = ebook.source;
    this.imageUrl = ebook.imageUrl;
    this.originImageUrl = ebook.originImageUrl;
    this.view = ebook.view;
    this.slug = ebook.slug;
    this.page = ebook.page;
};

Ebook.create = (newEbook, result) => {
    sql.query("INSERT INTO ebooks SET ?", newEbook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created Ebook: ", { id: res.insertId, ...newEbook });
        result(null, { id: res.insertId, ...newEbook });
    });
};

Ebook.findById = (ebookId, result) => {
    sql.query(`SELECT * FROM ebooks WHERE id = ${ebookId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Ebook: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Ebook with the id
        result({ kind: "not_found" }, null);
    });
};
Ebook.findByRangeId = (fromId, toId, result) => {
    sql.query(`SELECT * FROM ebooks WHERE id >= ${fromId} && id <=${toId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found Ebook: ", res);
            result(null, res);
            return;
        }

        // not found Ebook with the id
        result({ kind: "not_found" }, null);
    });
};

Ebook.findByKeyWord = (keyword, result) => {
    sql.query(`SELECT * FROM ebooks WHERE slug = '${keyword}'`, (err, res) => {
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

Ebook.getAll = result => {
    sql.query("SELECT * FROM ebooks", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("ebooks: ", res);
        result(null, res);
    });
};

Ebook.updateById = (id, ebook, result) => {
    sql.query(
        "UPDATE ebooks SET title = ?, alt = ?, source = ?, imageUrl = ?, originImageUrl = ?, view = ?, slug = ?, page = ? WHERE id = ?",
        [ebook.title, ebook.alt, ebook.source, ebook.imageUrl, ebook.originImageUrl, ebook.view, ebook.slug, ebook.page, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Ebook with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated Ebook: ", { id: id, ...ebook });
            result(null, { id: id, ...ebook });
        }
    );
};

Ebook.remove = (id, result) => {
    sql.query("DELETE FROM ebooks WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Ebook with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Ebook with id: ", id);
        result(null, res);
    });
};

module.exports = Ebook;