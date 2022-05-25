const Order = require("../models/order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken
} = require("./verifyToken");
const router = require("express").Router();

//create
router.post("/", verifyToken, (req, res) => {
    const newOrder = new Order(req.body);
    newOrder.save();
    try{
      res.status(200).json("items added to the database successfully");
    }catch(err){
      res.status(500).json(err);
    }
    
  });
  
  //update
  router.put("/:id", verifyTokenAndAdmin, (req, res) => {
    const id = req.params.id;
  
    Order.findByIdAndUpdate(
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
  router.delete("/:id",verifyTokenAndAdmin,(req,res)=>{
      const id = req.params.id;
      Order.findOneAndDelete({_id:id},(err)=>{
          if(!err){
              return res.status(200).json("Order deleted successfully")
          }
      })
  })

  //Get user Cart

  router.get("/find/:userId",verifyTokenAndAuthorization,(req,res) =>{
      Order.find({userId:req.params.userId},(err,data)=>{
          if(err){
              return res.json(err)
          }else{
              return res.status(200).json(data)
          }
      })
  })
  
  //Get all the Orders
  router.get("/",verifyTokenAndAdmin, (req, res) => {
    Order.find({}, (err, value) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.status(200).json(value);
      }
    });
  });

  //Get Monthly income

  router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    

    try{
      const income = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth },
            ...(productId && {
              products: { $elemMatch: { productId } },
            }),
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);

    }catch(err){
      return res.status(500).json(err)
    }
  })



module.exports = router