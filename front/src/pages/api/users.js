import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const handler = (req, res) => {
  if (req.method === "GET") {
    pool.query("SELECT * FROM Users", (err, results) => {
      if (err) {
        console.error("Database error: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
