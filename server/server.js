import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN,
});

app.get("/", (req, res) => {
  res.send("Hello this is running");
});

// GET all guestbook messages
app.get("/guestbook", async (req, res) => {
  try {
    const data = await db.query(
      `SELECT * FROM guestbook ORDER BY created_at DESC`,
    );
    res.status(200).json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// POST a new guestbook message
app.post("/guestbook", async (req, res) => {
  const { msg_name, content } = req.body;

  try {
    await db.query(
      `INSERT INTO guestbook (msg_name, content) VALUES ($1, $2)`,
      [msg_name, content],
    );
    res.status(200).json({ message: "Added message" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
});

app.listen(6363, () => {
  console.log(`Server started on port http://localhost:6363`);
});
