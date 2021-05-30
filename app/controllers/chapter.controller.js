const Chapter = require("../models/chapter.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Chapter
    const chapter = new Chapter({
        id: req.body.id,
        name: req.body.name,
        slug: req.body.slug
    });

    // Save Chapter in the database
    Chapter.create(chapter, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Chapter."
            });
        else res.send(data);
    });
};

// Retrieve all Chapter from the database.
exports.findAll = (req, res) => {
    Chapter.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    });
};

// Find a single Chapter with a customerId
exports.findOne = (req, res) => {
    Chapter.findById(req.params.chapterId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Chapter with id ${req.params.chapterId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Chapter with id " + req.params.chapterId
                });
            }
        } else res.send(data);
    });
};

// Update a Chapter identified by the categoryId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Chapter.updateById(
        req.params.chapterId,
        new Chapter(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Chapter with id ${req.params.chapterId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Chapter with id " + req.params.categoryId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Chapter with the specified categoryId in the request
exports.delete = (req, res) => {
    Chapter.remove(req.params.chapterId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Chapter with id ${req.params.chapterId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Chapter with id " + req.params.chapterId
                });
            }
        } else res.send({ message: `Chapter was deleted successfully!` });
    });
};

// Delete all Chapter from the database.
exports.deleteAll = (req, res) => {
    Chapter.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Chapter."
            });
        else res.send({ message: `All Chapter were deleted successfully!` });
    });
};