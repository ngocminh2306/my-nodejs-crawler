const sql = require("./db.js");

// constructor
const Chapter = function (chapter) {
    this.Id = chapter.id;
    this.Code = chapter.slug;
    this.Name = chapter.name;
    this.Title = chapter.name;
    this.UpdateTimeStr = chapter.update_time_str;
    this.View = chapter.view?chapter.view:0;
    this.Source = chapter.source;
    this.Slug = chapter.slug;
    this.DataId = chapter.data_id;
    this.EbookSlug = chapter.ebook_slug;
    this.Content = chapter.pages;
};


Chapter.create = (newChapter, result) => {
    sql.query("INSERT INTO Chapter SET ?, CreationTime = now(), EbookId = 0, Priority = 0, IsDeleted = false", newChapter, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newChapter });
    });
};

Chapter.findById = (chapterId, result) => {
    sql.query(`SELECT * FROM Chapter WHERE Id = ${chapterId}`, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length > 0) {
            // console.log("found Chapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result(null, null);
    });
};

Chapter.findByDataId = (chapterDataId, result) => {
    sql.query(`SELECT * FROM Chapter WHERE DataId = ${chapterDataId}`, (err, res) => {
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
        if (res.length == 0) {
            // console.log("found Chapter: ", res[0]);
            result(null, null);
            return;
        }
        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Chapter.findBySlug = (chapterSlug, result) => {
    sql.query(`SELECT * FROM Chapter WHERE Slug = '${chapterSlug}'`, (err, res) => {
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
    sql.query("SELECT * FROM Chapter", (err, res) => {
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
        "UPDATE Chapter SET Title = ?, Name = ?, Code = ?, UpdateTimeStr = ?, View = ?, Source = ?, Slug = ?, DataId = ?, EbookSlug = ?, Content = ?, ImageUrl = ?, IsDeleted = false   WHERE Id = ?",
        [chapter.Title, chapter.Name, chapter.Slug, chapter.UpdateTimeStr, chapter.View, chapter.Source, chapter.Slug, chapter.DataId, chapter.EbookSlug, chapter.Content, chapter.ImageUrl, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result(null, null);
                return;
            }

            //console.log("updated Chapter: ", { id: id, ...chapter });
            result(null, { id: id, ...Chapter });
        }
    );
};

module.exports = Chapter;