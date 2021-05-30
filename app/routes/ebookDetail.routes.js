module.exports = app => {
    const ebookDetail = require("../controllers/ebookDetail.controller.js");

    // Create a new ebook
    app.post("/ebookDetail", ebookDetail.create);

    // Retrieve all ebook
    app.get("/ebookDetail", ebookDetail.findAll);

    // Retrieve a single ebook with ebookId
    app.get("/ebookDetail/:ebookDetailId", ebookDetail.findOne);

    // Update a ebook with ebookId
    app.put("/ebookDetail/:ebookDetailId", ebookDetail.update);

    // Delete a ebook with ebookId
    app.delete("/ebookDetail/:ebookDetailId", ebookDetail.delete);

};