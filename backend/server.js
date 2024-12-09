// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");
// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const path = require("path");

// // Load the .proto file
// const PROTO_PATH = './clicker.proto';
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });
// const clickerProto = grpc.loadPackageDefinition(packageDefinition).ClickerPluginService;

// // Set up the gRPC client for the plugin
// const pluginClient = new clickerProto(
//   `${process.env.PLUGIN_HOST || 'localhost'}:${process.env.PLUGIN_PORT || '50051'}`,
//   grpc.credentials.createInsecure()
// );

// // Create Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // MySQL database connection
// const db = mysql.createConnection({
//   host: "db",      // Replace with your host
//   user: "root",           // Replace with your MySQL username
//   password: "password",   // Replace with your MySQL password
//   database: "counter_app" // Replace with your database name
// });


// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database!");
// });

// // Route to get the current counter value
// app.get("/api/counter", (req, res) => {
//   const query = "SELECT value FROM counter WHERE id = 1";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching counter value:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json({ count: results[0].value });
//   });
// });

// // Route to increment the counter
// app.post("/api/counter/increment", (req, res) => {
//   const query = "UPDATE counter SET value = value + 1 WHERE id = 1";
//   db.query(query, (err) => {
//     if (err) {
//       console.error("Error incrementing counter:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     // Fetch the updated counter value
//     db.query("SELECT value FROM counter WHERE id = 1", (err, results) => {
//       if (err) {
//         console.error("Error fetching updated counter:", err);
//         return res.status(500).json({ error: "Database error" });
//       }
//       res.json({ count: results[0].value });
//     });
//   });
// });




// app.post('/api/counter/plugin-increment', (req, res) => {
//   const { value } = req.body;

//   // Call the plugin server
//   pluginClient.IncrementByPlugin({ value }, (err, response) => {
//     if (err) {
//       console.error('Error calling plugin:', err);
//       return res.status(500).json({ error: 'Plugin error', details: err.message });
//     }

//     const updatedValue = response.result;

//     // Update the counter value in the database
//     const updateQuery = "UPDATE counter SET value = ? WHERE id = 1";
//     db.query(updateQuery, [updatedValue], (err) => {
//       if (err) {
//         console.error('Error updating counter value in database:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
//       res.json({ count: updatedValue });
//     });
//   });
// });


// // Start the Express server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the .proto file
const PROTO_PATH = './clicker.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const clickerProto = grpc.loadPackageDefinition(packageDefinition).ClickerPluginService;

// Set up the gRPC client for the plugin
const pluginClient = new clickerProto(
  `${process.env.PLUGIN_HOST || 'localhost'}:${process.env.PLUGIN_PORT || '50051'}`,
  grpc.credentials.createInsecure()
);

// Plugin state
let pluginEnabled = true;

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: "db", // Replace with your MySQL host
  user: "root", // Replace with your MySQL username
  password: "password", // Replace with your MySQL password
  database: "counter_app", // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database!");
});

// Route to get the current counter value
app.get("/api/counter", (req, res) => {
  const query = "SELECT value FROM counter WHERE id = 1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching counter value:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ count: results[0].value });
  });
});

// Route to increment the counter
app.post("/api/counter/increment", (req, res) => {
  const query = "UPDATE counter SET value = value + 1 WHERE id = 1";
  db.query(query, (err) => {
    if (err) {
      console.error("Error incrementing counter:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query("SELECT value FROM counter WHERE id = 1", (err, results) => {
      if (err) {
        console.error("Error fetching updated counter:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ count: results[0].value });
    });
  });
});

// Route to increment counter using plugin
app.post("/api/counter/plugin-increment", (req, res) => {
  const { value } = req.body;

  pluginClient.IncrementByPlugin({ value }, (err, response) => {
    if (err) {
      console.error("Error calling plugin:", err);
      return res.status(500).json({ error: "Plugin error", details: err.message });
    }

    const updatedValue = response.result;

    const updateQuery = "UPDATE counter SET value = ? WHERE id = 1";
    db.query(updateQuery, [updatedValue], (err) => {
      if (err) {
        console.error("Error updating counter value in database:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.json({ count: updatedValue });
    });
  });
});

// Route to toggle plugin state
app.post("/api/plugin-toggle", (req, res) => {
  pluginEnabled = !pluginEnabled;
  res.json({ pluginEnabled });
});

// Route to get plugin state
app.get("/api/plugin-status", (req, res) => {
  res.json({ pluginEnabled });
});
// New route for /api/ to respond with a simple message
app.get('/api/', (req, res) => {
  res.send('API is running');
});
// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
