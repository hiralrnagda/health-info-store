const express = require("express");
const router = express.Router();
const auth = require("../auth");

router.get("/getToken", async (req, res) => {
  const token = auth.keygen();
  // console.log(authe.authenticate(token));
  res.status(200).json({
    message: "SUCCESS!",
    token: token,
  });
});

router.post("/validateToken", async (req, res) => {
  validity = auth.validateToken(req);
  if (validity) {
    res.status(200).json({ message: "TOKEN VALID!" });
    return;
  } else {
    res.status(400).json({ message: "wrong bearer token/format" });
    return;
  }
});

module.exports = router;
