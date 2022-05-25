const Product = require("../models/products");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save().then(()=>{
    res.status(200).json("items added to the database successfully");
  })
});

router.put("/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;

  Product.findByIdAndUpdate(
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

//Get all the product
router.get("/", (req, res) => {
  let query = req.query.new;
  let category = req.query.categories;

  if (query) {
    Product.findOne({}, {}, { sort: { created_at: -1 } }, function (err, post) {
      return res.status(200).json(post);
    });
  } else if (category) {
    Product.find({ categories: category }, (err, data) => {
      if (err) {
        return res.status(401).json(err);
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    Product.find({}, (err, value) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json(value);
      }
    });
  }
});

router.get("/find/:id",((req,res)=>{
  try {
    Product.findById(req.params.id,function(err,data){
      if(!err){
        return res.status(200).json(data)
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
}))

module.exports = router;
