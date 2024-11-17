import express from "express";
import connect from "../database/connect.mjs";
import { checkSchema, validationResult } from "express-validator";
import schema from "./schema.mjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

router.use(async (req, resp, next) => {
  console.log(`Request received at ${new Date()} to ${req.url}`);
  if (req.url != "/ping" && req.url != "/register/user" && req.url != "/login") {
    // authorize the request
    const auth_header = req.header("Authorization");
    if (!auth_header) {
      resp.status(401).send({ error: "Unauthorized. No Authentication header provided" });
      return;
    }

    // Authorization: Bearer <token>
    var type = auth_header.split(" ")[0];
    var token = auth_header.split(" ")[1];
    console.log(`Token: ${token}`);
    if (type !== "Bearer") {
      resp.status(401).send({ error: "Unauthorized. Bad type for auth header" });
    }
    if (!token) {
      resp.status(401).send({ error: "Unauthorized. Auth header type mentioned but no token" });
      return;
    }
    try {
      var decoded = await auth.verifyToken(token);
      if (decoded === null) {
        resp.status(401).send({ error: "Unauthorized. Unable to verify decoded jwt user" });
        return;
      }
      console.log(`Decoded: ${JSON.stringify(decoded)}`);
    } catch (error) {
      resp.status(401).send({ error: "Unauthorized JWT" });
      return;
    }
  }
  next();
});

router.get("/ping", async (req, resp) => {
  var pong_resp = await connect.attemptPing();
  let collections = connect.db.collection("pings");
  let existingPing = await collections.findOne({ ip: req.ip });
  if (existingPing) {
    await collections.updateOne({ ip: req.ip }, { $inc: { pingCount: 1 } });
  } else {
    await collections.insertOne({ ip: req.ip, pingCount: 1 });
  }
  let updatedPing = await collections.findOne({ ip: req.ip });
  pong_resp == null ?
    resp.status(500).send(`XoX`) :
    // JSON.stringify(updatedPing)
    resp.status(200).send(`${JSON.stringify({
      type: "ping",
      response: "pong",
      pings: updatedPing.pingCount,
      ip: updatedPing.ip,
    })}`);
})

// Authentication

// User registeration
router.post(
  "/register/user",
  checkSchema(schema.newUserSchemaRequest),
  async (req, resp) => {
    // If invalid schema reject
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    let user = req.body;
    if (user === null) {
      resp.status(400).send({ error: "Invalid request" });
      return;
    }
    const query = { username: user.username };
    let collections = connect.db.collection("users");
    let result = await collections.findOne(query);

    if (result) {
      resp.status(400).send({
        message: "User already exists",
        user: {
          username: result.username,
        }
      });
      return;
    } else {
      let collections = connect.db.collection("users");
      await collections.insertOne({
        username: user.username,
        email: user.email,
        password: user.password,
        account_info: {
          followers: [],
          following: [],
          stories: []
        }
      });

      let result = await collections.findOne({ username: user.username });
      if (result) {

        // creating a jwt
        var token = jwt.sign({
          _id: result._id,
          username: result.username
        }, config.jwt.jwtSecret);

        resp.status(200).send({
          message: "User created",
          user: {
            jwt: token,
            username: result.username,
            email: result.email
          }
        });
      } else {
        resp.status(500).send({
          message: "User not created"
        });
      }
      return;
    }
  });

router.post("/login", checkSchema(schema.userLoginSchema), async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  let user = req.body;
  let collections = connect.db.collection("users");

  let result = await collections.findOne({
    username: user.username,
    password: user.password
  });

  if (result) {
    var token = jwt.sign({
      _id: result._id,
      username: result.username
    }, config.jwt.jwtSecret);
    resp.status(200).send({
      message: "User exists and logging in is allowed",
      user: {
        jwt: token,
        username: result.username,
        email: result.email
      }
    });
    return;
  } else {
    resp.status(404).send({
      message: "User not found"
    });
    return;
  }

});

router.get('/users/', async (req, resp) => {
  let collections = connect.db.collection("users");
  let users = await collections.find().toArray();
  if (users.length === 0) {
    resp.status(404).send({ error: "Users not found" });
  } else {
    resp.status(200).send(users);
  }
});

router.get("/user/:username", async (req, resp) => {

  let username = req.params.username;

  let collections = connect.db.collection("users");
  let user = await collections.findOne({ username: username });
  if (user) {
    resp.status(200).send({
      username: user.username,
      email: user.email,
      account_info: user.account_info
    });
  } else {
    resp.status(404).send({ error: "Users not found" });
  }
})

export default router;