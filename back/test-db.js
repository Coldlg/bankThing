const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "bank",
    });

    console.log("Successfully connected to the database");

    // Test Users table
    const [users] = await connection.execute("SELECT * FROM Users");
    console.log("Users table:", users);

    // Test Accounts table
    const [accounts] = await connection.execute("SELECT * FROM Accounts");
    console.log("Accounts table:", accounts);

    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

testConnection();
