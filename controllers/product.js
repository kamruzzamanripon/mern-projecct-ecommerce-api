const Product = require("../models/Product");
const formidable = require('formidable');
const fs = require('fs');
const { errorHandler } = require("../helper/dbErrorHandel");
const _ = require('lodash')



//Find a Product by Id
exports.productById =(req, res, next, id)=>{
    Product.findById(id)
        .populate("category")
        .exec((err, result)=>{
            if(err || !result){
                return res.status(400).json({
                    error: "Product Not found"
                })
            }

            req.product = result;
            next()
        })
}

exports.create = (req, res, next)=>{
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: "Image Upload Error"
            })
        }

        const {name, description, price, category, quantity, shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All Fields are required"
            })
        }

        let product = req.product;
        product = _.extend(product, fields)

        if(files.photo.size > 0){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image Size should be less than 1 MB"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }
        //console.log("part1")
        product.save((err, result)=>{
            //console.log("part2", err)
            if(err){
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }else{
                return res.json(result)
            }
        })
    })
}

//update product by id
exports.update = (req, res, next)=>{
    
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: "Image Upload Error"
            })
        }

       
        let product = req.product;
        product = _.extend(product, fields);

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image Size should be less than 1 MB"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }
        //console.log("part1")
        product.save((err, result)=>{
            //console.log("part2", err)
            if(err){
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }else{
                return res.json(result)
            }
        })

    })
}

//Delete a Product
exports.delete = (req, res, next)=>{
    let product = req.product;

    product.remove((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json({
                message: "Product Deleted Successfully"
            })
        }
    })
}


//Get Single Product info
exports.read = (req, res, next)=>{
    req.product.photo = undefined;

    return res.json(req.product)
}


//Get all Product info
exports.readAll = (req, res, next)=>{
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? req.query.limit : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([ [sortBy, order] ])
        .limit(limit)
        .exec((err, products)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }else{
                return res.send(products)
            }
        })
}

//get Single Product Photo
exports.getPhoto = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        //console.log("photo", req.product.photo.data)
        return res.send(req.product.photo.data)
    }
}

//Get all Product Categories
exports.getCategories =(req, res, next)=>{
    Product.distinct("category", {}, (err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(result)
        }
    })
}

//Get related products
exports.getRelatedProducts =(req, res, next)=>{
    let limit = req.query.limit ? req.query.limit : 2;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }else{
                return res.send(result)
            }
        })
}


//Search Product Data
exports.searchData = (req, res, next)=>{
    let order = req.body.order ? req.body.order : "asc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? req.body.limit : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};

    for (let key in req.body.filters){
        if(req.body.filters[key].length > 0){
            if(key == "price"){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                }
            }else{
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
        .exec((err, data)=>{
            if(err){
                return res.status(400).json({
                    error: "Product not Found"
                })
            }else{
                return res.json({
                    size: data.length,
                    data
                })
            }
        })

}

//get query search Data
exports.querySearchData = (req, res, next)=>{
    let query = {};
     if(req.query.search){
        query.name = { $regex: req.query.search, $options: "i"}
        if(req.query.category && req.query.category != "All"){
            query.category = req.query.category;
        }
     }

     Product.find(query, (err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(result);
        }
     })
}

//Decrease the quantity after an order
exports.decreaseQnt = (req, res, next) =>{
    let bulkOption = req.body.order.products.map((item)=>{
        return{
            updateOne:{
                filter: {_id: item._id},
                update: { $inc: {quantiy: -item.count, sold: +item.count}}
            }
        }
    })

    Product.bulkWrite(bulkOption, {}, (err,data)=>{
        if(err){
            return res.status(400).json({
                error: "Can't Update the Product"
            })
        }else{
            next()
        }
    })
}