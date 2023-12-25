const express = require("express");
const router = express.Router();
const Ev = require("../models/ev.js");
const { verifyToken, isAdmin } = require("../middlewears/jwt_verify.js");

router.post("/dbupdate", verifyToken("admin"), function (req, res) {
  const v_id = req.body.vehicle_id;
  const comp_up = req.body.company;
  const vehi_up = req.body.vehicle;

  var evs = new Ev({
    vehicle_id: req.body.vehicle_id,
    company: req.body.company,
    vehicle: req.body.vehicle,
    price: req.body.price,
    Max_Power: req.body.Max_Power,
    Rated_Power: req.body.Rated_Power,
    Max_Torque: req.body.Max_Torque,
    Battery_capacity: req.body.Battery_capacity,
    charge_consumption: req.body.charge_consumption,
    Battery_type: req.body.Battery_type,
    No_of_Batteries: req.body.No_of_Batteries,
    range: req.body.range,
    speed: req.body.speed,
    Acceleration_0_to_60: req.body.Acceleration_0_to_60,
    Battery_charging_time: req.body.Battery_charging_time,
    Fast_charging: req.body.Fast_charging,
    Riding_Modes: req.body.Riding_Modes,
    Transmission: req.body.Transmission,
    Motor_type: req.body.Motor_type,
    Portable_Battery: req.body.Portable_Battery,
    Swappable_Battery: req.body.Swappable_Battery,
    Charger_Type: req.body.Charger_Type,
    Carrying_capacity: req.body.Carrying_capacity,
    Overall_Width: req.body.Overall_Width,
    Overall_Height: req.body.Overall_Height,
    Kerb_Weight: req.body.Kerb_Weight,
    Battery_warranty: req.body.Battery_warranty,
    Motor_warranty: req.body.Motor_warranty,
    Connectivity: req.body.Connectivity,
    Navigation: req.body.Navigation,
    Operating_System: req.body.Operating_System,
    Processor: req.body.Processor,
    Mobile_Application: req.body.Mobile_Application,
    other_features: req.body.other_features,
    colors: req.body.colors,
    main_photo: req.body.main_photo,
    photo1: req.body.photo1,
    photo2: req.body.photo2,
    company_link: req.body.company_link,
    reviews: req.body.reviews,
  });
  //console.log(Ev.find({company:comp_up,vehicle:vehi_up}));
  Ev.find({
    company: comp_up,
    vehicle: vehi_up,
  })
    .then((result) => {
      if (result.length) {
        console.log("Db already exists ! cannot add redundant pairs");
        res.json({ error: "Redundant pairs detected !!!" });
      } else {
        Ev.insertMany(evs)
          .then((result) => {
            console.log("Items added succesfully");
            res.json("Items added succesfully");
          })
          .catch((err) => {
            console.log(err);
            res.json({
              error:
                "Internal error occured, check the values again and enter properly",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error:
          "Internal error occured, check the values again and enter properly",
      });
    });
});

router.post("/db_update", verifyToken("admin"), function (req, res) {
  var key_vehicle = req.body.vehicle;
  console.log(key_vehicle);
  var to_update = req.body.to_update;
  console.log(to_update);
  var to_update_data = req.body.update_data;
  console.log(to_update_data);
  Ev.updateOne(
    {
      vehicle: key_vehicle,
    },
    {
      $set: {
        [to_update]: to_update_data,
      },
    }
  )
    .then((result) => {
      //console.log(result);
      if (result.modifiedCount > 0) {
        console.log("Db updated successfully");
        res.json("DB updated successfully");
      } else {
        console.log("Could not update the data");
        res.json({ error: "Could not update the data !!!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "Server error !!!" });
    });
});

router.post("/dbdelete", verifyToken("admin"), function (req, res) {
  var item = 1;
  const veh_del = req.body.vehicle_del;
  Ev.find({
    vehicle: veh_del,
  })
    .then((resu) => {
      if (resu.length) {
        console.log("Deletion in progress");
      } else {
        console.log("Item not found !!");
        res.json({ error: "Item not found !!!" });
        item = 0;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  Ev.deleteOne({
    vehicle: veh_del,
  })
    .then((result) => {
      Ev.find({
        vehicle: veh_del,
      })
        .then((results) => {
          if (results.length) {
            console.log("Could'nt find your specified item!");
            res.json({ error: "Could'nt find your specified item!!!" });
          } else {
            if (item != 0) {
              console.log(veh_del + " Deleted successfully !");
              res.json(" Deleted successfully");
            }
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({ error: "Some error occured, check the entered values" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "Some error occured, check the entered values" });
    });
});

module.exports = router;
