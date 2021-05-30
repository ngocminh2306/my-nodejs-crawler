module.exports = app => {
    const ebook = require("../controllers/ebook.controller.js");
  
    // Create a new ebook
    app.post("/ebook", ebook.create);
  
    // Retrieve all ebook
    app.get("/ebook", ebook.findAll);
  
    // Retrieve a single ebook with ebookId
    app.get("/ebook/:ebookId", ebook.findOne);
  
    // Update a ebook with ebookId
    app.put("/ebook/:ebookId", ebook.update);
  
    // Delete a ebook with ebookId
    app.delete("/ebook/:ebookId", ebook.delete);

  };