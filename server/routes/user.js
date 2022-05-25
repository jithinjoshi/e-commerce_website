const User = require("../models/user");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(
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

//Get all the users
router.get("/", verifyTokenAndAdmin, (req, res) => {
  let query = req.query.new;
  console.log(query);

  query
    ? User.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      return res.status(200).json(post);
    })
    : User.find({}, (err, value) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json(value);
        }
      });
});

//Get Users Stats

router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
  console.log(lastYear);

  const data =  await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data)
})


module.exports = router;
