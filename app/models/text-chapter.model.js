const sql = require("./db.js");

// constructor
const TextChapter = function (chapter) {
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


TextChapter.create = (newChapter, result) => {
    sql.query("INSERT INTO TextChapter SET ?, CreationTime = now(), EbookId = 0, Priority = 0, IsDeleted = false", newChapter, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newChapter });
    });
};

TextChapter.findById = (chapterId, result) => {
    sql.query(`SELECT * FROM TextChapter WHERE Id = ${chapterId}`, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length > 0) {
            // console.log("found TextChapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result(null, null);
    });
};

TextChapter.findByDataId = (chapterDataId, result) => {
    sql.query(`SELECT * FROM TextChapter WHERE DataId = ${chapterDataId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found TextChapter: ", res[0]);
            result(null, res[0]);
            return;
        }
        if (res.length == 0) {
            // console.log("found TextChapter: ", res[0]);
            result(null, null);
            return;
        }
        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

TextChapter.findBySlug = (chapterSlug, result) => {
    sql.query(`SELECT * FROM TextChapter WHERE Slug = '${chapterSlug}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found TextChapter: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

TextChapter.getAll = result => {
    sql.query("SELECT * FROM TextChapter", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("chapter: ", res);
        result(null, res);
    });
};
TextChapter.getAllByEbookSlug = (ebookSlug, result) => {
    sql.query(`SELECT * FROM TextChapter WHERE EbookSlug = '${ebookSlug}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

TextChapter.updateById = (id, chapter, result) => {
    sql.query(
        "UPDATE TextChapter SET Title = ?, Name = ?, Code = ?, UpdateTimeStr = ?, View = ?, Source = ?, Slug = ?, DataId = ?, EbookSlug = ?, Content = ?, ImageUrl = ?, IsDeleted = false   WHERE Id = ?",
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

            //console.log("updated TextChapter: ", { id: id, ...chapter });
            result(null, { id: id, ...TextChapter });
        }
    );
};
TextChapter.updateLocalContent = (chapter, content, result) => {
    console.log("start update LocalContent !")
    sql.query(
        "UPDATE TextChapter SET LocalContent = ? Where Id = ?",
        [content, chapter.Id],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result(null, null);
                return;
            }
            console.log("updated TextChapter: ", { id: chapter.Id, name: chapter.Name });
            result(null, { id: chapter.Id, name: chapter.Name });
        }
    );
};

module.exports = TextChapter;