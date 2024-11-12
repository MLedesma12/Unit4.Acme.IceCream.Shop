const pg = require("pg");
const express = require("express");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://mario:password12@localhost:5432/acme_ice_cream"
);
const app = express();
app.use(express.json());
client.connect();

app.get("/api/get-flavors", async (req, res, next) => {
  try {
    const response = await client.query(`
            SELECT * FROM icecream;`);
    const result = response.rows[0];
    res.status(201).send({ message: "Found these flavors", result });
  } catch (err) {
    console.error("Couldnt get flavors: ", err);
  }
});

app.get("/api/get-flavors/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await client.query(
      `
            SELECT flavor FROM icecream
            WHERE id=$1;`,
      [id]
    );
    const result = response.rows[0];
    res.status(201).send({ message: "Found the flavor", result });
  } catch (err) {
    console.error("Couldnt get flavor: ", err);
  }
});

app.post("/api/get-flavors", async (req, res, next) => {
  const { flavor, is_favorite } = req.body;

  try {
    const response = await client.query(
      `
            INSERT INTO icecream (flavor, is_favorite)
            VALUES ($1, $2)
            RETURNING *;`,
      [flavor, is_favorite]
    );
    const result = response.rows[0];
    res.status(201).send({ message: "added the new flavor ", result });
  } catch (err) {
    console.error("Couldnt add flavors: ", err);
  }
});

app.delete("/api/get-flavors/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await client.query(
      `
              DELETE FROM icecream
              WHERE id=$1;`,
      [id]
    );
    const result = response.rows[0];
    res.status(201).send({ message: "deleted the flavor", result });
  } catch (err) {
    console.error("Couldnt delete flavor: ", err);
  }
});

app.put("/api/get-flavors/:id", async (req, res, next) => {
  const { flavor } = req.body;
  const { id } = req.params;
  try {
    const response = await client.query(
      `
        UPDATE icecream
        SET flavor=$1
        WHERE id=$2
        RETURNING *;`,
      [flavor, id]
    );
    const result = response.rows[0];
    res.status(201).send({ message: "updated the flavor", result });
  } catch (err) {
    console.error("Couldnt update flavors: ", err);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
