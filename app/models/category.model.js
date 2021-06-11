const sql = require("./db.js");

// constructor
const Category = function (category) {
    this.Id = category.id;
    this.Code = category.slug;
    this.Name = category.name;
    this.Slug = category.slug;
    this.Description = category.description;
    this.Source = category.source;
    this.PageCount = category.pageCount;
};

Category.create = (newCategory, result) => {
    sql.query("INSERT INTO EbookCategory SET ?, CreationTime = now(), IsDeleted = false", newCategory, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { Id: res.insertId, ...newCategory, CrawlerStatus: 'Create'  });
    });
};

Category.findById = (categoryId, result) => {
    sql.query(`SELECT * FROM EbookCategory WHERE Id = ${categoryId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found category: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Category.findBySlug = (categorySlug, result) => {
    sql.query(`SELECT * FROM EbookCategory WHERE Slug = '${categorySlug}'`, (err, res) => {
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

Category.getAll = result => {
    sql.query("SELECT * FROM EbookCategory", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("categories: ", res);
        result(null, res);
    });
};

Category.updateById = (Id, category, result) => {
    sql.query(
        "UPDATE EbookCategory SET Name = ?, Slug = ?, Description = ?, Source = ?, PageCount = ?, CrawlerDate = now(), LastModificationTime = now()   WHERE Id = ?",
        [category.Name, category.Slug, category.Description, category.Source, category.PageCount, Id],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result(null, null);
                return;
            }
            category.Id = Id;
            result(null, { ...category, CrawlerStatus: 'Update' });
        }
    );
};

Category.CreateOrUpdate = (newCategory) => {
    return new Promise((resolve, reject) => {
        Category.findBySlug(newCategory.Slug, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data) {
                    //Update
                    Category.updateById(data.Id, newCategory, (err, data1) => {
                        if (err)
                            reject(err)
                        else {
                            resolve(data1)
                        }
                    })
                } else {
                    //Insert
                    Category.create(newCategory, (err, data1) => {
                        if (err)
                            reject(err)
                        else {
                            resolve(data1)
                        }
                    })
                }
            }
        })
    })
}

module.exports = Category;