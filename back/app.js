// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Create an instance of Express
const app = express();

// Use CORS to allow requests from your frontend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "070707",
  database: "bank",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes

// Get all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new user (Signup)
app.post("/signup", async (req, res) => {
  const { name, email, age, password, phone_number } = req.body;

  try {
    // Check if the user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const [result] = await pool.query(
      "INSERT INTO Users (name, email, age, password, balance, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?, CURDATE())",
      [name, email, age, hashedPassword, 0, phone_number]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key-here",
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Example of a protected route (JWT Authentication required)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key-here",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// Get user profile
app.get("/user", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, age, balance, phone_number, created_at FROM Users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      console.log("User not found with ID:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Get user accounts
app.get("/accounts", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Accounts WHERE user_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Create new account
app.post("/accounts", authenticateToken, async (req, res) => {
  const { currency, balance } = req.body;

  try {
    // Generate a unique account number
    const accountNumber = Math.floor(1000000 + Math.random() * 9000000);

    const [result] = await pool.query(
      "INSERT INTO Accounts (account_number, currency, balance, status, created_at, user_id) VALUES (?, ?, ?, ?, CURDATE(), ?)",
      [accountNumber, currency || "MNT", balance || 100, true, req.user.id]
    );

    const [newAccount] = await pool.query(
      "SELECT * FROM Accounts WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newAccount[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get account transactions
app.get(
  "/accounts/:accountId/transactions",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Transactions WHERE account_id = ? ORDER BY transaction_date DESC",
        [req.params.accountId]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Create a transfer
app.post("/transfers", authenticateToken, async (req, res) => {
  const { amount, receiver_account, description } = req.body;

  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get sender's account
      const [senderAccounts] = await connection.query(
        "SELECT * FROM Accounts WHERE user_id = ? AND status = true",
        [req.user.id]
      );

      if (senderAccounts.length === 0) {
        throw new Error("No active accounts found");
      }

      const senderAccount = senderAccounts[0];

      // Check if receiver account exists
      const [receiverAccounts] = await connection.query(
        "SELECT * FROM Accounts WHERE account_number = ? AND status = true",
        [receiver_account]
      );

      if (receiverAccounts.length === 0) {
        throw new Error("Receiver account not found");
      }

      const receiverAccount = receiverAccounts;

      // Check if sender has enough balance
      if (senderAccount.balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Update balances
      await connection.query(
        "UPDATE Accounts SET balance = balance - ? WHERE id = ?",
        [amount, senderAccount.id]
      );

      await connection.query(
        "UPDATE Accounts SET balance = balance + ? WHERE id = ?",
        [amount, receiverAccount.id]
      );

      // Create transfer record
      await connection.query(
        "INSERT INTO Transfers (amount, sender, receiver, description, transfer_time) VALUES (?, ?, ?, ?, NOW())",
        [
          amount,
          senderAccount.account_number,
          receiverAccount.account_number,
          description,
        ]
      );

      // Create transaction records
      await connection.query(
        "INSERT INTO Transactions (amount, type, transaction_date, description, account_id) VALUES (?, 'transfer_out', CURDATE(), ?, ?)",
        [amount, description, senderAccount.id]
      );

      await connection.query(
        "INSERT INTO Transactions (amount, type, transaction_date, description, account_id) VALUES (?, 'transfer_in', CURDATE(), ?, ?)",
        [amount, description, receiverAccount.id]
      );

      await connection.commit();
      res.status(201).json({ message: "Transfer completed successfully" });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
