const sql = require("./db.js");

// constructor
const Chapter = function (chapter) {
    this.id = chapter.id;
    this.name = chapter.name;
    this.update_time_str = chapter.update_time_str;
    this.view = chapter.view;
    this.source = chapter.source;
    this.slug = chapter.slug;
    this.data_id = chapter.data_id;
    this.ebook_id = chapter.ebook_id;
};

Chapter.create = (newChapter, result) => {
    sql.query("INSERT INTO chapter SET ?", newChapter, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created chapter: ", { id: res.insertId, ...newChapter });
        result(null, { id: res.insertId, ...newChapter });
    });
};

Chapter.findById = (chapterId, result) => {
    sql.query(`SELECT * FROM chapter WHERE id = ${chapterId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.findByDataId = (chapterDataId, result) => {
    sql.query(`SELECT * FROM chapter WHERE data_id = ${chapterDataId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }
        if (res.length == 0) {
            console.log("found Chapter: ", res[0]);
            result(null, null);
            return;
        }
        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.findByDataId = (chapterDataId, result) => {
    sql.query(`SELECT * FROM chapter WHERE data_id = ${chapterDataId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }
        if (res.length == 0) {
            console.log("found Chapter: ", res[0]);
            result(null, null);
            return;
        }
        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.findBySlug = (chapterSlug, result) => {
    sql.query(`SELECT * FROM chapter WHERE slug = '${chapterSlug}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.findByEBookId = (eBookId, result) => {
    sql.query(`SELECT * FROM chapter WHERE ebook_id = ${eBookId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Chapter: ", res);
            result(null, res);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.getAll = result => {
    sql.query("SELECT * FROM chapter", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("chapter: ", res);
        result(null, res);
    });
};

Chapter.updateById = (id, Chapter, result) => {
    sql.query(
        "UPDATE chapter SET name = ?, update_time_str = ?, view = ?, source = ?, slug = ?, data_id = ?, ebook_id = ?   WHERE id = ?",
        [Chapter.name, Chapter.update_time_str, Chapter.view, Chapter.source, Chapter.slug, Chapter.data_id, Chapter.ebook_id, id],
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

            console.log("updated Chapter: ", { id: id, ...Chapter });
            result(null, { id: id, ...Chapter });
        }
    );
};

Chapter.remove = (id, result) => {
    sql.query("DELETE FROM chapter WHERE id = ?", id, (err, res) => {
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

        console.log("deleted chapter with id: ", id);
        result(null, res);
    });
};

Chapter.removeAll = result => {
    sql.query("DELETE FROM chapter", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} chapter`);
        result(null, res);
    });
};

module.exports = Chapter;