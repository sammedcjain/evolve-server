const express = require("express");
const router = express.Router();
const fs = require("fs");
const User = require("../models/users.js");
const Ev = require("../models/ev.js");
const { verifyToken, isAdmin } = require("../middlewears/jwt_verify.js");

router.get("/evdb", verifyToken("user"), function (req, res) {
  var total_users;

  User.countDocuments()
    .then((count) => {
      total_users = count;
    })
    .catch((err) => {
      console.log(err);
    });
  const username = req.user.username;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        var data = user.data;
        var vehicles = [];

        var promises = data.map((vehicle) => {
          return Ev.find({
            vehicle: vehicle,
          })
            .then((result) => {
              //console.log(result);
              if (result.length > 0) {
                vehicles.push(result);
              } else {
                // Remove the vehicle from the data array
                data = data.filter((v) => v !== vehicle);
              }
            })
            .catch((err) => console.log(err));
        });

        Promise.all(promises)
          .then(() => {
            //console.log(vehicles, data);
            var sortedData = data.map((vehicle) => {
              var foundVehicle = vehicles.find((v) => v[0].vehicle === vehicle);
              return foundVehicle ? foundVehicle[0] : null;
            });
            res.json({
              recent_vehicles: data,
              vehicle_data: sortedData,
              user_count: total_users,
            });
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("User not found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/requirements", verifyToken("user"), function (req, res) {
  Ev.find(
    {},
    {
      company: 1,
      _id: 0,
    }
  )
    .then((result) => {
      var comp_names = [];
      result.forEach(function (each) {
        comp_names.push(each);
      });
      res.json(comp_names);
      //console.log(comp_names)
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/data", function (req, res) {
  var comp = req.body.company;
  var pri = req.body.price;
  //console.log(req.params.username);
  if (pri != 10000000) {
    pri = pri * 1000;
  } else if (pri == "any") {
    pri = 10000000;
  }
  var ran = req.body.range;

  var spd = req.body.speed;

  //console.log(comp,pri,ran,spd);

  if (req.body.showall == "showall") {
    Ev.find()
      .then((result) => {
        var data = [];
        result.forEach(function (each) {
          //console.log(each);
          data.push(each);
        });
        res.json({
          evdb: data,
          redirectUrl: "/dbtable",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (comp == "any") {
    Ev.find({
      price: {
        $lte: pri,
      },
      range: {
        $gte: ran,
      },
      speed: {
        $gte: spd,
      },
    })
      .then((result) => {
        var data = [];
        result.forEach(function (each) {
          //console.log(each);
          data.push(each);
        });
        res.json({
          evdb: data,
          redirectUrl: "/dbtable",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (pri != 126000) {
    Ev.find({
      company: comp,
      price: {
        $lte: pri,
      },
      range: {
        $gte: ran,
      },
      speed: {
        $gte: spd,
      },
    })
      .then((result) => {
        var data = [];
        result.forEach(function (each) {
          //console.log(each);
          data.push(each);
        });
        res.json({
          evdb: data,
          redirectUrl: "/dbtable",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Ev.find({
      company: comp,
      price: {
        $gte: pri,
      },
      range: {
        $gte: ran,
      },
      speed: {
        $gte: spd,
      },
    })
      .then((result) => {
        var data = [];
        result.forEach(function (each) {
          //console.log(each);
          data.push(each);
        });
        res.json({
          evdb: data,
          redirectUrl: "/dbtable",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // var body = "";
  // filePath = __dirname + "/views/dbtable.ejs";
  // req.on("data", function (data) {
  //   body += data;
  // });
  //
  // req.on("end", function () {
  //   fs.appendFile(filePath, body, function () {
  //     res.end();
  //   });
  // });
});

router
  .route("/vehicle_info/:vehicle")

  .get(verifyToken("user"), function (req, res) {
    const user = req.user.username;
    //console.log(user,req.params.vehicle);

    User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $addToSet: {
          data: req.params.vehicle,
        },
      }
    )
      .then(() => {
        return User.updateOne(
          {
            _id: req.user.id,
          },
          {
            $push: {
              data: {
                $each: [],
                $slice: -3,
              },
            },
          }
        );
      })
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    Ev.find({
      vehicle: req.params.vehicle,
    })
      .then((result) => {
        //console.log(result);
        var vehicle_info = [];
        result.forEach(function (each) {
          vehicle_info.push(each);
        });
        res.json(vehicle_info);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(req.params.vehicle);
  });

module.exports = router;
