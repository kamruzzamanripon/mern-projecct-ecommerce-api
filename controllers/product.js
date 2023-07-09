const Product = require("../models/Product");
const formadable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

//internal import
const { errorHandler } = require("../helper/dbErrorHandel.js");

//find a product by  id
exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, result) => {
      if (err || !result) {
        return res.status(400).json({
          error: "Product Not Found",
        });
      }

      req.product = result;
      next();
    });
};

//create a new product
exports.create = (req, res, next) => {
  let form = new formadable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image Upload Error",
      });
    }

    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All Fields are required",
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image Size should be less than 1 MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contetType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        return res.json(result);
      }
    });
  });
};

//update a product info
exports.update = (req, res, next) => {
  let form = new formadable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image Upload Error",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo.size > 0) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image Size should be less than 1 MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contetType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        return res.json(result);
      }
    });
  });
};

//delete a product
exports.delete = (req, res, next) => {
  let product = req.product;

  product.remove((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    } else {
      return res.json({
        message: "Product Deleted Successfully",
      });
    }
  });
};

//get single product info
exports.read = (req, res, next) => {
  return res.json(req.product);
};

//get all product info
exports.readAll = (req, res, next) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        return res.send(products);
      }
    });
};

//get single product photo
exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contetType);
    return res.send(req.product.photo.data);
  }
};

//get all product categories
exports.getCategories = (req, res, next) => {
  Product.distinct("category", {}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    } else {
      return res.json(result);
    }
  });
};

//get related product
exports.getRelatedProducts = (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 2;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        return res.send(result);
      }
    });
};

// search product data
exports.searchData = (req, res, next) => {
  let order = req.body.order ? req.body.order : "asc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not Found",
        });
      } else {
        return res.json({
          size: data.length,
          data,
        });
      }
    });
};

//get query search data
exports.querySearchData = (req, res, next) => {
  let query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }

    Product.find(query, (err, result) => {
      console.log(err);
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        return res.json(result);
      }
    });
  }
};

//decrease the qnt after an order
exports.decreaseQnt = (req, res, next) => {
  let bulkOption = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } }
      }
    }
  })

  Product.bulkWrite(bulkOption, {}, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Can't Update the Product"
      });
    } else {
      next();
    }
  })
}
