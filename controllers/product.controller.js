const Product = require("../models/Product.model");
const createError = require("http-errors");

module.exports.list = (req, res, next) => {
  Product.find()
    .populate("reviews")
    .populate("user")
    .then((products) => {
      res.json(products);
    })
    .catch((e) => next(e));
};

module.exports.create = (req, res, next) => {
  const product = new Product({
    ...req.body,
    user: req.session.user.id,
  });
  product
    .save()
    .then((p) => {
      res.json(p);
    })
    .catch((e) => next(e));
};

module.exports.edit = (req, res, next) => {
  Product.findById(req.params.id)
    .then((p) => {
      if (p.user != req.currentUser.id) {
        throw createError(403, "You can't edit another user's products");
      } else {
        return p.update(req.body).then((editedProduct) => {
          res.json(editedProduct);
        });
      }
    })
    .catch((e) => next(e));
};
