const sql = require("./db.js");

// constructor
const Category = function (category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.source = category.source;
    this.pageCount = category.pageCount;
    this.createdTime = Date.now();
};

Category.create = (newCategory, result) => {
    sql.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newCategory, crawler_status: 'Create'  });
    });
};

Category.findById = (categoryId, result) => {
    sql.query(`SELECT * FROM categories WHERE id = ${categoryId}`, (err, res) => {
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
    sql.query(`SELECT * FROM categories WHERE slug = '${categorySlug}'`, (err, res) => {
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
    sql.query("SELECT * FROM categories", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("categories: ", res);
        result(null, res);
    });
};

Category.updateById = (id, category, result) => {
    sql.query(
        "UPDATE categories SET name = ?, slug = ?, description = ?, source = ?, pageCount = ?, updatedTime = now()   WHERE id = ?",
        [category.name, category.slug, category.description, category.source, category.pageCount, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            category.id = id;
            result(null, { ...category, crawler_status: 'Update' });
        }
    );
};

Category.remove = (id, result) => {
    sql.query("DELETE FROM categories WHERE id = ?", id, (err, res) => {
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

        console.log("deleted categories with id: ", id);
        result(null, res);
    });
};

Category.removeAll = result => {
    sql.query("DELETE FROM categories", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} categories`);
        result(null, res);
    });
};

Category.CreateOrUpdate = (newCategory) => {
    return new Promise((resolve, reject) => {
        Category.findBySlug(newCategory.slug, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data) {
                    //Update
                    Category.updateById(data.id, newCategory, (err, data1) => {
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