const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorhandler");
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

app.use(logger);
app.use(errorHandler);
// dotenv.config();
connectDB();
app.use(express.json());

// auth routes here
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 8050 || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
