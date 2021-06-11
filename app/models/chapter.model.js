const sql = require("./db.js");

// constructor
const Chapter = function (chapter) {
    this.Id = chapter.id;
    this.name = chapter.name;
    this.update_time_str = chapter.update_time_str;
    this.view = chapter.view;
    this.source = chapter.source;
    this.slug = chapter.slug;
    this.data_id = chapter.data_id;
    this.ebook_slug = chapter.ebook_slug;
    this.pages = chapter.pages;
};

Chapter.create = (newChapter, result) => {
    sql.query("INSERT INTO chapter SET ?, CreationTime = now()", newChapter, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newChapter });
    });
};

Chapter.findById = (chapterId, result) => {
    sql.query(`SELECT * FROM chapter WHERE Id = ${chapterId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length > 0) {
            console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result(null, null);
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

Chapter.updateById = (id, chapter, result) => {
    sql.query(
        "UPDATE chapter SET name = ?, update_time_str = ?, view = ?, source = ?, slug = ?, data_id = ?, ebook_slug = ?, pages = ?, CrawlerDate = now()   WHERE Id = ?",
        [chapter.name, chapter.update_time_str, chapter.view, chapter.source, chapter.slug, chapter.data_id, chapter.ebook_slug, chapter.pages, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result({ kind: "update not_found" }, null);
                return;
            }

            //console.log("updated Chapter: ", { id: id, ...chapter });
            result(null, { id: id, ...Chapter });
        }
    );
};

module.exports = Chapter;