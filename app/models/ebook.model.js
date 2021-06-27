const sql = require("./db.js");

// constructor
const Ebook = function (ebook) {
    this.Code = ebook.slug;
    this.Name =  ebook.title;
    this.Title = ebook.title;
    this.Description = ebook.content;
    this.ImageUrl = ebook.imageUrl;
    this.Author = ebook.author;
    this.CategoryString = ebook.cates;
    this.View = ebook.view?ebook.view:0;
    this.Rate = ebook.rate;
    this.OrtherName = ebook.orther_name;
    this.StatusString = ebook.status_str;
    this.Slug =ebook.slug;
    this.Source = ebook.source;
    this.chapters = ebook.chapters? ebookDetail.chapters: [];
};

Ebook.create = (newEbook, result) => {
    let ebook = newEbook;
    delete ebook.chapters;
    sql.query("INSERT INTO Ebooks SET ?, CreationTime = now(), IsDeleted = false, EbookCategoryId = 0, Priority = 0", ebook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
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
Ebook.getAllRange = result => {
    sql.query("SELECT * FROM Ebooks Where Id > 2000	 And Id < 20640", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log(res.length)
        result(null, res);
    });
};

Ebook.updateById = (id, ebook, result) => {
    sql.query(
        "UPDATE Ebooks SET Code = ?, Title = ?, Name = ?, Source = ?, ImageUrl = ?, OriginImageUrl = ?, View = ?, Slug = ?, Description = ?, Author = ?, CategoryString = ?, StatusString = ?, Rate = ?, OrtherName = ?, CrawlerDate = now() WHERE Id = ?",
        [ebook.Code, ebook.Title, ebook.Name, ebook.Source, ebook.ImageUrl, ebook.OriginImageUrl, ebook.View, ebook.Slug, ebook.Description, ebook.Author, ebook.CategoryString, ebook.StatusString , ebook.Rate, ebook.OrtherName,  id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Ebook with the id
                result(null, null);
                return;
            }

            // console.log("updated Ebook: ", { id: id, ...ebook });
            result(null, { id: id, ...ebook });
        }
    );
};

Ebook.updateImage = (id, imageUrl, result) => {
    sql.query(
        "UPDATE Ebooks SET OriginImageUrl = ?, CrawlerDate = now() WHERE Id = ?",
        [imageUrl, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result( err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Ebook with the id
                result(null, null);
                return;
            }

            console.log("updated Ebook: " + id);
            result(null, { id: id, imageUrl:imageUrl });
        }
    );
};
module.exports = Ebook;