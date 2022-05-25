const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    

router.post("/register",(req,res)=>{
    const password = req.body.password;

    bcrypt.hash(password,10,function(err,data){
        if(err){
            console.log(err);
        }else{
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                password:data
                });
                newUser.save()
        }
    })
});

router.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username:username},function(err,data){
        if(data===null){
            res.status(500).json("User doesn't exist")
        }else if(err){
            return res.status(500).json("can't find user")
    
        }else{
            bcrypt.compare(password,data.password,function(err,result){
                if(err){
                    console.log(err);
                }
                else if(result===false){
                    return res.status(500).json("wrong password")
                }else{
                    const accessToken = jwt.sign({
                        id:data._id,
                        isAdmin:data.isAdmin
                    },process.env.JWT_SECRET)

                    const{password, ...others} = data._doc
                    return res.status(200).json({...others,accessToken})
                }
            })
        }
    })
})
    

module.exports = router;

