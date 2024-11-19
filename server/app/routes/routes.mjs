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
  if (
    req.url != "/ping" &&
    req.url != "/register/user" &&
    req.url != "/login"
  ) {
    // authorize the request
    const auth_header = req.header("Authorization");
    if (!auth_header) {
      resp
        .status(401)
        .send({ error: "Unauthorized. No Authentication header provided" });
      return;
    }

    // Authorization: Bearer <token>
    var type = auth_header.split(" ")[0];
    var token = auth_header.split(" ")[1];
    console.log(`Token: ${token}`);
    if (type !== "Bearer") {
      resp
        .status(401)
        .send({ error: "Unauthorized. Bad type for auth header" });
    }
    if (!token) {
      resp.status(401).send({
        error: "Unauthorized. Auth header type mentioned but no token",
      });
      return;
    }
    try {
      var decoded = await auth.verifyToken(token);
      if (decoded === null) {
        resp
          .status(401)
          .send({ error: "Unauthorized. Unable to verify decoded jwt user" });
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
  pong_resp == null
    ? resp.status(500).send(`XoX`)
    : // JSON.stringify(updatedPing)
      resp.status(200).send(
        `${JSON.stringify({
          type: "ping",
          response: "pong",
          pings: updatedPing.pingCount,
          ip: updatedPing.ip,
        })}`
      );
});

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
        },
      });
      return;
    } else {
      let collections = connect.db.collection("users");
      await collections.insertOne({
        username: user.username,
        email: user.email,
        password: user.password,
        account_info: {
          recipes: [],
          favorites: [] 
        }
      });

      let result = await collections.findOne({ username: user.username });
      if (result) {
        // creating a jwt
        var token = jwt.sign(
          {
            _id: result._id,
            username: result.username,
          },
          config.jwt.jwtSecret
        );

        resp.status(200).send({
          message: "User created",
          user: {
            jwt: token,
            username: result.username,
            email: result.email,
          },
        });
      } else {
        resp.status(500).send({
          message: "User not created",
        });
      }
      return;
    }
  }
);

router.post(
  "/login",
  checkSchema(schema.userLoginSchema),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    let user = req.body;
    let collections = connect.db.collection("users");

    let result = await collections.findOne({
      username: user.username,
      password: user.password,
    });

    if (result) {
      var token = jwt.sign(
        {
          _id: result._id,
          username: result.username,
        },
        config.jwt.jwtSecret
      );
      resp.status(200).send({
        message: "User exists and logging in is allowed",
        user: {
          jwt: token,
          username: result.username,
          email: result.email,
        },
      });
      return;
    } else {
      resp.status(404).send({
        message: "User not found",
      });
      return;
    }
  }
);

router.get("/users/", async (req, resp) => {
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
      account_info: user.account_info,
    });
  } else {
    resp.status(404).send({ error: "Users not found" });
  }
});

router.post(
  "/recipe",
  checkSchema(schema.newRecipeSchemaRequest),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    let recipe = req.body;
    if (recipe === null) {
      resp.status(400).send({ error: "Invalid request" });
      return;
    }

    try {
      let collections = connect.db.collection("recipes");
      const existingRecipe = await collections.findOne({
        username: recipe.username,
        title: recipe.title,
      });

      if (existingRecipe) {
        resp.status(400).send({
          message: "Recipe with this title already exists for this user",
          recipe: {
            title: existingRecipe.title,
            username: existingRecipe.username,
          },
        });
        return;
      }

      recipe.createdAt = new Date();
      recipe.updatedAt = new Date();

      const result = await collections.insertOne(recipe);

      if (result.insertedId) {
        const usersCollection = connect.db.collection("users");
        await usersCollection.updateOne(
          { username: recipe.username },
          { $push: { "account_info.recipes": result.insertedId } }
        );

        resp.status(201).send({
          message: "Recipe created successfully",
          recipe: {
            id: result.insertedId,
            title: recipe.title,
            category: recipe.category,
            username: recipe.username,
          },
        });
      } else {
        resp.status(500).send({
          message: "Failed to create recipe",
        });
      }
    } catch (error) {
      resp.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

router.put(
  "/recipe/:id",
  checkSchema(schema.updateRecipeRequest),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    try {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
        resp.status(400).send({ error: "Invalid recipe ID format" });
        return;
      }

      const updates = req.body;
      updates.updatedAt = new Date();

      let collections = connect.db.collection("recipes");

      const existingRecipe = await collections.findOne({
        _id: new ObjectId(recipeId),
      });

      if (!existingRecipe) {
        resp.status(404).send({ error: "Recipe not found" });
        return;
      }

      const authHeader = req.header("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await auth.verifyToken(token);

      if (existingRecipe.username !== decoded.username) {
        resp
          .status(403)
          .send({ error: "Not authorized to update this recipe" });
        return;
      }

      const result = await collections.updateOne(
        { _id: new ObjectId(recipeId) },
        { $set: updates }
      );

      if (result.modifiedCount === 1) {
        resp.status(200).send({
          message: "Recipe updated successfully",
          recipeId: recipeId,
        });
      } else {
        resp.status(500).send({
          message: "Failed to update recipe",
        });
      }
    } catch (error) {
      resp.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/recipe/:id",
  checkSchema(schema.deleteRecipeRequest),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    try {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
        resp.status(400).send({ error: "Invalid recipe ID format" });
        return;
      }

      let collections = connect.db.collection("recipes");

      const existingRecipe = await collections.findOne({
        _id: new ObjectId(recipeId),
      });

      if (!existingRecipe) {
        resp.status(404).send({ error: "Recipe not found" });
        return;
      }

      const authHeader = req.header("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await auth.verifyToken(token);

      if (existingRecipe.username !== decoded.username) {
        resp
          .status(403)
          .send({ error: "Not authorized to delete this recipe" });
        return;
      }

      const result = await collections.deleteOne({
        _id: new ObjectId(recipeId),
      });

      if (result.deletedCount === 1) {
        const usersCollection = connect.db.collection("users");
        await usersCollection.updateOne(
          { username: existingRecipe.username },
          { $pull: { "account_info.recipes": new ObjectId(recipeId) } }
        );

        resp.status(200).send({
          message: "Recipe deleted successfully",
          recipeId: recipeId,
        });
      } else {
        resp.status(500).send({
          message: "Failed to delete recipe",
        });
      }
    } catch (error) {
      resp.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

router.get("/recipes", async (req, resp) => {
  try {
    let collections = connect.db.collection("recipes");
    const recipes = await collections.find({}).toArray();

    if (recipes.length === 0) {
      resp.status(404).send({ message: "No recipes found" });
    } else {
      resp.status(200).send(recipes);
    }
  } catch (error) {
    resp.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/recipes/byuser/:username", async (req, resp) => {
  try {
    const username = req.params.username;
    let collections = connect.db.collection("recipes");
    const recipes = await collections.find({ username: username }).toArray();

    if (recipes.length === 0) {
      resp.status(404).send({ message: "No recipes found for this user" });
    } else {
      resp.status(200).send(recipes);
    }
  } catch (error) {
    resp.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/recipes/byid/:id", async (req, resp) => {
  try {
    const recipeId = req.params.id;
    if (!ObjectId.isValid(recipeId)) {
      resp.status(400).send({ error: "Invalid recipe ID format" });
      return;
    }

    let collections = connect.db.collection("recipes");
    const recipe = await collections.findOne({ _id: new ObjectId(recipeId) });

    if (!recipe) {
      resp.status(404).send({ message: "Recipe not found" });
    } else {
      resp.status(200).send(recipe);
    }
  } catch (error) {
    resp.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post(
  "/recipe/:id/rate",
  checkSchema(schema.addRatingSchema),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    try {
      const recipeId = req.params.id;
      if (recipeId.length !== 24) {
        resp
          .status(400)
          .send({ message: "recipe id is of an invalid format!" });
        return;
      }
      const rating = parseInt(req.body.rating);
      const authHeader = req.header("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await auth.verifyToken(token);
      const username = decoded.username;

      let recipesCollection = connect.db.collection("recipes");
      let ratingsCollection = connect.db.collection("ratings");

      const recipe = await recipesCollection.findOne({
        _id: ObjectId.createFromHexString(recipeId),
      });

      if (!recipe) {
        resp.status(404).send({ error: "Recipe not found" });
        return;
      }

      const existingRating = await ratingsCollection.findOne({
        recipeId: ObjectId.createFromHexString(recipeId),
        username: username,
      });

      if (existingRating) {
        const result = await ratingsCollection.updateOne(
          {
            recipeId: ObjectId.createFromHexString(recipeId),
            username: username,
          },
          {
            $set: {
              rating: rating,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount === 1) {
          await updateAverageRating(
            recipeId,
            recipesCollection,
            ratingsCollection
          );
          resp.status(200).send({
            message: "Rating updated successfully",
            rating: rating,
          });
        } else {
          resp.status(500).send({
            message: "Failed to update rating",
          });
        }
      } else {
        const result = await ratingsCollection.insertOne({
          recipeId: ObjectId.createFromHexString(recipeId),
          username: username,
          rating: rating,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (result.insertedId) {
          await updateAverageRating(
            recipeId,
            recipesCollection,
            ratingsCollection
          );
          resp.status(201).send({
            message: "Rating added successfully",
            rating: rating,
          });
        } else {
          resp.status(500).send({
            message: "Failed to add rating",
          });
        }
      }
    } catch (error) {
      resp.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

async function updateAverageRating(
  recipeId,
  recipesCollection,
  ratingsCollection
) {
  const ratings = await ratingsCollection
    .find({
      recipeId: new ObjectId(recipeId),
    })
    .toArray();

  const averageRating =
    ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
  const totalRatings = ratings.length;

  await recipesCollection.updateOne(
    { _id: new ObjectId(recipeId) },
    {
      $set: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings: totalRatings,
      },
    }
  );
}

router.get("/recipe/:id/ratings", async (req, resp) => {
  try {
    const recipeId = req.params.id;
    if (!ObjectId.isValid(recipeId)) {
      resp.status(400).send({ error: "Invalid recipe ID format" });
      return;
    }

    let ratingsCollection = connect.db.collection("ratings");
    const ratings = await ratingsCollection
      .find({
        recipeId: new ObjectId(recipeId),
      })
      .toArray();

    const ratingStats = {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    if (ratings.length > 0) {
      ratingStats.totalRatings = ratings.length;
      ratingStats.averageRating = parseFloat(
        (
          ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        ).toFixed(1)
      );

      ratings.forEach((rating) => {
        ratingStats.ratingDistribution[rating.rating]++;
      });
    }

    resp.status(200).send(ratingStats);
  } catch (error) {
    resp.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/recipe/:id/myrating", async (req, resp) => {
  try {
    const recipeId = req.params.id;
    if (!ObjectId.isValid(recipeId)) {
      resp.status(400).send({ error: "Invalid recipe ID format" });
      return;
    }

    const authHeader = req.header("Authorization");
    const token = authHeader.split(" ")[1];
    const decoded = await auth.verifyToken(token);
    const username = decoded.username;

    let ratingsCollection = connect.db.collection("ratings");
    const rating = await ratingsCollection.findOne({
      recipeId: new ObjectId(recipeId),
      username: username,
    });

    if (rating) {
      resp.status(200).send({
        rating: rating.rating,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      });
    } else {
      resp.status(404).send({
        message: "No rating found for this recipe",
      });
    }
  } catch (error) {
    resp.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post(
  "/recipe/:id/favorite",
  checkSchema(schema.toggleFavoriteSchema),
  async (req, resp) => {
      try {
          const recipeId = req.params.id;
          if (!ObjectId.isValid(recipeId)) {
              resp.status(400).send({ error: "Invalid recipe ID format" });
              return;
          }

          const authHeader = req.header("Authorization");
          const token = authHeader.split(" ")[1];
          const decoded = await auth.verifyToken(token);
          const username = decoded.username;

          let usersCollection = connect.db.collection("users");
          let recipesCollection = connect.db.collection("recipes");

          const query = {
            _id: ObjectId.createFromHexString(recipeId)
          };

          const recipe = await recipesCollection.findOne(query);

          if (!recipe) {
              resp.status(404).send({ error: "Recipe not found" });
              return;
          }

          const user = await usersCollection.findOne({
              username: username,
              "account_info.favorites": ObjectId.createFromHexString(recipeId)
          });

          if (user) {
              await usersCollection.updateOne(
                  { username: username },
                  { $pull: { "account_info.favorites": ObjectId.createFromHexString(recipeId) } }
              );
              resp.status(200).send({
                  message: "Recipe removed from favorites",
                  isFavorited: false
              });
          } else {
              await usersCollection.updateOne(
                  { username: username },
                  { $push: { "account_info.favorites": ObjectId.createFromHexString(recipeId) } }
              );
              resp.status(200).send({
                  message: "Recipe added to favorites",
                  isFavorited: true
              });
          }
      } catch (error) {
          resp.status(500).send({
              message: "Internal server error",
              error: error.message
          });
      }
  }
);

router.get("/favorites", async (req, resp) => {
  try {
      const authHeader = req.header("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await auth.verifyToken(token);
      const username = decoded.username;

      let usersCollection = connect.db.collection("users");
      let recipesCollection = connect.db.collection("recipes");

      const user = await usersCollection.findOne({ username: username });
      
      if (!user || !user.account_info.favorites) {
          resp.status(200).send([]);
          return;
      }

      const favorites = await recipesCollection.find({
          _id: { $in: user.account_info.favorites }
      }).toArray();

      resp.status(200).send(favorites);
  } catch (error) {
      resp.status(500).send({
          message: "Internal server error",
          error: error.message
      });
  }
});

router.get("/recipe/:id/favorite", async (req, resp) => {
  try {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
          resp.status(400).send({ error: "Invalid recipe ID format" });
          return;
      }

      const authHeader = req.header("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await auth.verifyToken(token);
      const username = decoded.username;

      let usersCollection = connect.db.collection("users");

      const user = await usersCollection.findOne({
          username: username,
          "account_info.favorites": ObjectId.createFromHexString(recipeId)
      });

      resp.status(200).send({
          isFavorited: !!user
      });
  } catch (error) {
      resp.status(500).send({
          message: "Internal server error",
          error: error.message
      });
  }
});

export default router;
