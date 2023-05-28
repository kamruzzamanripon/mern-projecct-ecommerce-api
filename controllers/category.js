const Category = require("../models/Category");


//internal import
const { errorHandler } = require("../helper/dbErrorHandel.js");



//find category by id
exports.categoryById = (req,res,next, id) =>{
    Category.findById(id).exec((err, result)=>{
        if(err || !result) {
            return res.status(400).json({
                error: "Category does not found!",
              });
        }else{
            req.category  = result;
            next();
        }
    })
}

//create category
exports.create = (req,res, next) =>{
   let category =  new Category(req.body);

   category.save( (err,result) =>{
       if(err){
        console.log(err)
        return res.status(400).json({
            error: errorHandler(err),
          });
       }else{
        return res.json( result );
       }
   })
}


// update a category
exports.update = (req,res,next) =>{
    const category  =  req.category;
    category.name = req.body.name;

    category.save( (err,result) =>{
        if(err){
         console.log(err)
         return res.status(400).json({
             error: errorHandler(err),
           });
        }else{
         return res.json(result);
        }
    })
}

//delete a category
exports.delete = (req,res,next) =>{
    const category  =  req.category;
   
    category.remove( (err,result) =>{
        if(err){
         console.log(err)
         return res.status(400).json({
             error: errorHandler(err),
           });
        }else{
         return res.json({ message: "Category Deleted Successfully!" });
        }
    })
}


//get single category
exports.read = (req,res,next)=>{
    return res.json(  req.category );
}

//get all categories name
exports.readAll = (req, res,next) =>{
    Category.find().exec((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err),
              });
        }else{
            return res.json( result );
        }
    })
}