const Cart = require("../models/cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, (req, res) => {
    const newCart = new Cart(req.body);
    newCart.save();
    res.status(200).json("items added to the database successfully");
  });
  
  //update
  router.put("/:id", verifyTokenAndAuthorization, (req, res) => {
    const id = req.params.id;
  
    Cart.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true },
      function (err, data) {
        if (err) {
          return res.status(401).json("can't update");
        } else {
          return res.status(200).json(data);
        }
      }
    );
  });

  //Delete
  router.delete("/:id",verifyTokenAndAuthorization,(req,res)=>{
      const id = req.params.id;
      Cart.findOneAndDelete({_id:id},(err)=>{
          if(!err){
              return res.status(200).json("Item deleted successfully")
          }
      })
  })

  //Get user Cart

  router.get("/find/:userId",verifyTokenAndAuthorization,(req,res) =>{
      Cart.findOne({userId:req.params.userId},(err,data)=>{
          if(err){
              return res.json(err)
          }else{
              return res.status(200).json(data)
          }
      })
  })
  
  //Get all the users
  router.get("/",verifyTokenAndAdmin, (req, res) => {
    Cart.find({}, (err, value) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.status(200).json(value);
      }
    });
  });

  

module.exports = router