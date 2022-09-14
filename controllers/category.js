const { errorHandler } = require("../helper/dbErrorHandel");
const Category = require("../models/Category");

 
//find category by Id
exports.categoryById =(req, res, next, id)=>{
    Category.findById(id).exec((err, result)=>{
        if(err || !result){
            return res.status(400).json({
                error: "Category does not found",
            })
        }else{
            req.category = result;
            next();
        }
    })
}


exports.create = (req, res, next) => {
  let category = new Category(req.body);

  category.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler,
      });
    } else {
      return res.json( result );
    }
  });
};

//update a category
exports.update =(req, res, next)=>{
    const category = req.category;
    category.name = req.body.name;

    category.save((err, result)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(result)
        }
    })
}

//delete a Categoy 
exports.delete =(req, res, next)=>{
    const category = req.category;
   

    category.remove((err, result)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json({ message: "Category Deleted Successfullly"})
        }
    })
}

//single category read
exports.read = (req, res, next)=>{
    return res.json(req.category)
}

//get all Cate
exports.readAll = (req, res, next)=>{
    Category.find().exec((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err),
            })
        }else{
            return res.json(result)
        }
    })
}
