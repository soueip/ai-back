const{check, validationResult}=require("express-validator")

exports.registerRules=()=>[

    check("name","name is required ").notEmpty(),
    check("lastName","lastName is required ").notEmpty(),
    check("email","email is required ").notEmpty(),
    check("email","email is wrong ").isEmail(),
    check("companywebsite","companywebsite is required ").notEmpty(),
    check("companywebsite","companywebsite is wrong ").isURL(),
    check("phone","phone is required ").notEmpty(),
    check("phone","phone is required ").isMobilePhone(),
    check("phone","phone is required ").notEmpty(),
    check("password","password must be at least 6 carcter ").isLength({
        min: 6,
        max:20,
    }),

];

exports.loginRules=()=>
[
    check("email","email is required ").notEmpty(),
    check("email","check email again ").isEmail(),
    check("password","password must be at least 6 carcter  ").isLength({
        min: 6,
        max:20,
    }),
];

exports.validation=(req,res,next)=>{
    const errors=validationResult(req)
    console.log(errors);
    if (!errors.isEmpty()){
        return res.status(400).send({errors:errors.array().map((el)=>({
            msg :el.msg
        })),
        });
        } 
    next();
};