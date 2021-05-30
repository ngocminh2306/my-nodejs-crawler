const sql = require("./db.js");

// constructor
const ChapterDetail = function (chapter_detail) {
    this.id = chapter_detail.id;
    this.data_id = chapter_detail.data_id;
    this.pages = chapter_detail.pages;
};

ChapterDetail.create = (newChapterDetail, result) => {
    sql.query("INSERT INTO chapter_detail SET ?", newChapterDetail, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created chapter_detail: ", { id: res.insertId, ...newChapterDetail });
        result(null, { id: res.insertId, ...newChapterDetail });
    });
};

ChapterDetail.findById = (chapterDetailId, result) => {
    sql.query(`SELECT * FROM chapter_detail WHERE id = ${chapterDetailId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found chapter_detail: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

ChapterDetail.findByDataId = (chapterDetailId, result) => {
    sql.query(`SELECT * FROM chapter_detail WHERE data_id = ${chapterDetailId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found chapter_detail: ", res[0]);
            result(null, res[0]);
            return;
        }
        if (res.length == 0) {
            console.log("found chapter_detail: ", res[0]);
            result(null, null);
            return;
        }
        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

ChapterDetail.getAll = result => {
    sql.query("SELECT * FROM chapter_detail", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("chapter_detail: ", res);
        result(null, res);
    });
};

ChapterDetail.updateById = (id, chapter_detail, result) => {
    sql.query(
        "UPDATE chapter_detail SET data_id = ?, pages = ?  WHERE id = ?",
        [chapter_detail.data_id, chapter_detail.pages, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated chapter_detail: ", { id: id, ...chapter_detail });
            result(null, { id: id, ...chapter_detail });
        }
    );
};

ChapterDetail.remove = (id, result) => {
    sql.query("DELETE FROM chapter_detail WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted chapter_detail with id: ", id);
        result(null, res);
    });
};

ChapterDetail.removeAll = result => {
    sql.query("DELETE FROM chapter_detail", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} chapter_detail`);
        result(null, res);
    });
};

module.exports = ChapterDetail;