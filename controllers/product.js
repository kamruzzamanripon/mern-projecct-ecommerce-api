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

        let product = new Product(fields);

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

