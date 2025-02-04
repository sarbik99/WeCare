if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();  // Load environment variables in development
}

const connectDB = require("./config/connection.db");
const app = require("./app.js");
const therapistRoutes = require("./routes/therapistRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes.js")
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173', // Allow your frontend URL (React) here
    credentials: true,               // Allow credentials (cookies)
};
const cookieParser = require("cookie-parser");
app.use(cookieParser());  
app.use(cors(corsOptions));

// Connect to MongoDB and then start the server
connectDB()
    .then(() => {
        console.log("Database connected successfully");

        // Register API routes
        app.use("/api/therapists", therapistRoutes);
        app.use("/api/appointments" , appointmentRoutes);
        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit the process if database connection fails
    });
