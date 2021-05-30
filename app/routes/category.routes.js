module.exports = app => {
    const category = require("../controllers/category.controller.js");
  
    // Create a new category
    app.post("/category", category.create);
  
    // Retrieve all category
    app.get("/category", category.findAll);
  
    // Retrieve a single category with categoryId
    app.get("/category/:categoryId", category.findOne);
  
    // Update a category with categoryId
    app.put("/category/:categoryId", category.update);
  
    // Delete a category with categoryId
    app.delete("/category/:categoryId", category.delete);
  
    // Create a new category
    app.delete("/category", category.deleteAll);
  };