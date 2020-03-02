const router = require("express").Router();
const database = require("../config/database");
const Developer = require("../models/developer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/devs", verify, async (req, res) => {
  try {
    const developer = await Developer.findAll();
    res.json(developer);
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

router.route("/developerAdd").post(async (req, res) => {
  const { devname, email, skype, telephone, status, pic, about } = req.body;
  try {
    const dev = await Developer.findAll({ where: { email: email } });
    if (dev.length) {
      res.send(`User with this ${email} already exists`);
      return;
    }
    const response = await Developer.create({
      devname,
      email,
      skype,
      telephone,
      status,
      pic,
      about
    });
    res.json(response);
  } catch (err) {
    console.log("Error: " + err);
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  try {
    const developer = await Developer.destroy({ where: { id: req.params.id } });
    if (!developer) {
      res.send("There is no such developer in the DB");
      return;
    }
    res.json("Developer deleted");
  } catch (err) {
    console.log("Error: " + err);
  }
});

router.route("/update/:id").put(async (req, res) => {
  const { devname, email, skype, telephone, status, pic, about } = req.body;
  console.log("DEVVNAME", pic);

  try {
    const dev = await Developer.findOne({ where: { id: req.params.id } });
    if (!dev) {
      res.send("There is no such project in the DB");
      return;
    }
    const developer = await Developer.update(
      { devname, email, skype, telephone, status, pic, about },
      { returning: true, where: { id: req.params.id } }
    );
    res.json(developer);
  } catch (err) {
    console.log("Error: " + err);
  }
});

// Registration new Developer
router.route("/register").post(async (req, res) => {
  const { devname, email, password, pic } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const dev = await Developer.findAll({ where: { email: email } });
    if (dev.length) {
      res.send(`User with this ${email} already exists`);
      return;
    }
    const response = await Developer.create({
      devname,
      email,
      password: hashedPassword,
      pic
    });
    res.json(response);
  } catch (err) {
    console.log("Error: " + err);
  }
});

// LOGIN
router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const dev = await Developer.findOne({ where: { email: email } });
    if (!dev) {
      res.send(`User with this ${email} is wrong`);
      return;
    }
    const validPass = await bcrypt.compare(req.body.password, dev.password);
    if (!validPass) return res.status(400).send("Invalid password");

    // Create token
    const token = jwt.sign({ id: dev.id }, process.env.TOKEN_SECRET);
    res.header("auth-toekn", token).send(token);

    // res.send("Logged in");
  } catch (err) {
    console.log("Error: " + err);
  }
});

module.exports = router;
