const Ebook = require("../models/ebook.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Ebook
    const ebook = new Ebook({
        id: req.body.id,
        name: req.body.name,
        slug: req.body.slug
    });

    // Save Ebook in the database
    Ebook.create(ebook, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Ebook."
            });
        else res.send(data);
    });
};

// Retrieve all Ebook from the database.
exports.findAll = (req, res) => {
    Ebook.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Ebooks."
            });
        else res.send(data);
    });
};

// Find a single Ebook with a ebookId
exports.findOne = (req, res) => {
    Ebook.findById(req.params.ebookId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Ebook with id ${req.params.ebookId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Ebook with id " + req.params.ebookId
                });
            }
        } else res.send(data);
    });
};

// Update a Ebook identified by the EbookId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Ebook.updateById(
        req.params.ebookId,
        new Ebook(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Ebook with id ${req.params.ebookId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Ebook with id " + req.params.ebookId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Ebook with the specified EbookId in the request
exports.delete = (req, res) => {
    Ebook.remove(req.params.ebookId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Ebook with id ${req.params.ebookId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Ebook with id " + req.params.ebookId
                });
            }
        } else res.send({ message: `Ebook was deleted successfully!` });
    });
};