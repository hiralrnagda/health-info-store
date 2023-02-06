const express = require("express");
const router = express.Router();
/* defining JSON schema for plans */
var Validator = require("jsonschema").Validator;
var validator = new Validator();
const schema = {
  type: "object",
  properties: {
    objectID: { type: "string" },
    name: { type: "string" },
    cost: { type: "integer" },
    deductible: { type: "integer" },
    "co-pay": { type: "integer" },
  },
  required: ["objectID", "name", "cost"],
  additionalProperties: false,
};

const hash = require("object-hash");
const client = require("../db");

router.post("/", async (req, res) => {
  console.log("POST: /plans");
  console.log(req.body);
  // req.body = JSON.parse(req.body);
  const isValid = validator.validate(req.body, schema);
  if (isValid.errors.length < 1) {
    req.body = isValid.instance;
    const value = await client.hGetAll(req.body.objectID);
    if (value.objectID == req.body.objectID) {
      res.status(409).json({ message: "item already exists" });
      console.log("item already exists");
      return;
    } else {
      const etag = hash(req.body);
      console.log(etag);
      for (const item in req.body) {
        await client.hSet(req.body.objectID, item, req.body[item]);
      }
      await client.hSet(req.body.objectID, "etag", etag);
      res.status(201).json({
        message: "item added",
        etag: etag,
      });
      console.log("item added");
      return;
    }
  } else {
    res.status(400).json({ message: "item isn't valid" });
    console.log("item isn't valid");
    return;
  }
});

router.get("/:planId", async (req, res) => {
  console.log("GET: plans/");
  console.log(req.params);
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    console.log("invalid plan ID");
    return;
  }
  const value = await client.hGetAll(req.params.planId);
  if (value.objectID == req.params.planId) {
    res.status(200).json(value);
    console.log("plan found:");
    console.log(value);
    return;
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});
router.get("/", async (req, res) => {
  console.log("GET: /plans. Invalid request");
  res.status(400).json({ message: "invalid plan ID" });
  console.log("invalid plan ID");
  return;
});

router.delete("/:planId", async (req, res) => {
  console.log("DELETE: /plans");
  console.log(req.params);
  if (
    req.params.planId == null &&
    req.params.planId == "" &&
    req.params == {}
  ) {
    res.status(400).json({ message: "invalid plan ID" });
    return;
  }
  const value = await client.hGetAll(req.params.planId);
  if (value.objectID == req.params.planId) {
    console.log("item found");
    console.log(value);
    const delResult = await client.del(req.params.planId);
    if (delResult) {
      console.log("item deleted");
      res.status(200).json(value);
    } else {
      console.log("item not deleted");
      res.status(500).json({ message: "item not deleted" });
    }

    return;
  } else {
    res.status(404).json({ message: "plan not found" });
    console.log("plan not found");
    return;
  }
});

router.delete("/", async (req, res) => {
  console.log("DELETE: /plans. Invalid request");
  res.status(400).json({ message: "invalid plan ID" });
  return;
});

module.exports = router;
