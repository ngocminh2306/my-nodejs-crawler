const sql = require("./db.js");

// constructor
const Post = function (post) {
    Id = post.Id;
    post_detail_url = post.post_detail_url;
    post_thumb_url = post.post_thumb_url;
    post_title = post.post_title;
    post_description = post.post_description;
    url_crawler = post.url_crawler;
    create_at = post.create_at;
    display = post.display;
    slug = post.slug;
    content = post.content;
    post_category = post.post_category;
    related_post = post.related_post;
    key_word = post.key_word;
    is_top = post.is_top;
    toc_content = post.toc_content;
    DisplayToc = post.DisplayToc;
    origin_thumb_url = post.origin_thumb_url;
}


Ebook.getAll = result => {
    sql.query("SELECT * FROM Posts", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Ebook.findByKeyWord = (keyword, result) => {
    sql.query(`SELECT * FROM Posts WHERE Slug = '${keyword}'`, (err, res) => {
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
module.exports = Ebook;