const EbookDetail = require("../models/ebookDetail.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a EbookDetail
    const ebookDetail = new EbookDetail({
        id: req.body.id,
        name: req.body.name,
        slug: req.body.slug
    });

    // Save EbookDetail in the database
    EbookDetail.create(ebookDetail, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the EbookDetail."
            });
        else res.send(data);
    });
};

// Retrieve all EbookDetail from the database.
exports.findAll = (req, res) => {
    EbookDetail.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Ebooks."
            });
        else res.send(data);
    });
};

// Find a single EbookDetail with a ebookId
exports.findOne = (req, res) => {
    EbookDetail.findById(req.params.ebookDetailId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found EbookDetail with id ${req.params.ebookDetailId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving EbookDetail with id " + req.params.ebookDetailId
                });
            }
        } else res.send(data);
    });
};

// Update a EbookDetail identified by the EbookId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    EbookDetail.updateById(
        req.params.ebookDetailId,
        new EbookDetail(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found EbookDetail with id ${req.params.ebookId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating EbookDetail with id " + req.params.ebookId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a EbookDetail with the specified EbookId in the request
exports.delete = (req, res) => {
    EbookDetail.remove(req.params.ebookDetailId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found EbookDetail with id ${req.params.ebookDetailId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete EbookDetail with id " + req.params.ebookDetailId
                });
            }
        } else res.send({ message: `EbookDetail was deleted successfully!` });
    });
};