const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const Admin = require("../models/admin.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require("../middlewears/jwt_verify.js");

//user authentication =>

router.get("/register", cors(), function (req, res) {});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Log in the user after successful registration and generate a JWT token
    const token = jwt.sign(
      { username: newUser.username, role: "user" },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token, redirectUrl: "/evdb" });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error occurred" });
  }
});

router.get("/login", cors(), function (req, res) {});

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ error: "Invalid Username" });
    }

    // Ensure that user.password contains the hashed password from the database
    if (!user.password) {
      return res.json({ error: "Invalid Password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ error: "Invalid Password" });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign(
      { username: user.username, role: "user" },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, redirectUrl: "/evdb" });
  } catch (error) {
    console.error(error);
    res.json({ error: "An error occurred during login" });
  }
});

router.get("/logout", cors(), function (req, res) {
  res.json({ message: "Logout successful" });
});

//admin authentication =>

router.get(
  "/admin_registeration_Tony_De_Cost_Invite",
  cors(),
  function (req, res) {}
);

// router.post("/admin_register", function (req, res) {
//   bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//     var user = req.body.username;
//     var pass = hash;
//     //console.log(pass);
//     const newAdmin = new Admin({
//       username: user,
//       password: pass,
//     });
//     newAdmin
//       .save()
//       .then((result) => {
//         console.log("admins added succesfully");
//         res.render("admin");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// });

router.post("/admin_register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is present in the invitee array
    const inviteeCheckAdmin = await Admin.findOne({ invitee: username });

    if (!inviteeCheckAdmin) {
      return res.json({ error: "Username not present in the invitee list" });
    }

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    // Log in the admin after successful registration and generate a JWT token
    const token = jwt.sign(
      { username: newAdmin.username, role: "admin" },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token, redirectUrl: "/admin_post" });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error occurred" });
  }
});

router.get("/admin_login", cors(), function (req, res) {});

router.get("/fail", function (req, res) {
  res.render("auth_failed");
});

// router.post("/admin_login", function (req, res) {
//   var user = req.body.username;
//   var pass = req.body.password;

//   Admin.findOne({
//     username: user,
//   })
//     .then((result) => {
//       console.log("login credentials found");
//       //console.log("results ="+result);
//       bcrypt.compare(pass, result.password, function (err, presult) {
//         if (presult == true) {
//           res.render("admin");
//         } else {
//           res.redirect("/fail");
//           console.log("Password validation unsuccessful");
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

router.post("/admin_login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.json({ error: "Invalid Username" });
    }

    // Ensure that admin.password contains the hashed password from the database
    if (!admin.password) {
      return res.json({ error: "Invalid Password" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.json({ error: "Invalid Password" });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, redirectUrl: "/admin_post" });
  } catch (error) {
    console.error(error);
    res.json({ error: "An error occurred during login" });
  }
});

router.get("/admin_post", cors(), verifyToken("admin"), function (req, res) {
  res
    .status(200)
    .json({ message: "Authentication successful", user: req.user });
});

router.post("/admin_invitee", verifyToken("admin"), async function (req, res) {
  const { username, inviteeEmail } = req.body;
  console.log(username, inviteeEmail);
  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.json({ error: "Admin not found" });
    }

    // Check if inviteeEmail is already in the invitee array
    if (admin.invitee.includes(inviteeEmail)) {
      return res.json({ error: "Invitee email already present" });
    }

    // Add the inviteeEmail to the invitee array
    admin.invitee.push(inviteeEmail);

    // Save the updated admin document
    await admin.save();
    return res.json({ message: "Invitee added successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Internal Server Error" });
  }
});
module.exports = router;
