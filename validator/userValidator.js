

exports.userSignupValidator = (req,res, next) =>{
    req.check("name", "Name is required").notEmpty();
    req
    .check("email", "Email must be 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email Must Contain @ ")
    .isLength({ min: 4, max: 32 });

    req.check("password", "Password is Required").notEmpty();
    req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password Must Contain a Number");

    req.check("about", "About is Required").notEmpty();

    const errors  = req.validationErrors();

    if(errors){
        const firstError =  errors.map((error)=> error.msg)[0];

        return res.status(400).json({error: firstError})
    }

    next();
}
