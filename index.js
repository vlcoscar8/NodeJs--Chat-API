import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connect } from "./config/connect.database.js";
import { authRoutes } from "./routes/auth.routes.js";
import { chatRoutes } from "./routes/chat.routes.js";
import { userRoutes } from "./routes/user.routes.js";

dotenv.config();

// Config
const app = express();
const router = express.Router();
const SESSION_SECRET = process.env.SESSION_SECRET;
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

//Socket connection
io.on("connection", (socket) => {
    console.log("Connected");

    socket.on("new user", () => {
        console.log("User created");
    });

    socket.on("new message", (data) => {
        io.emit("new message", data);
    });
});

//cors
app.use(cors());

// Read json
app.use(express.json());

//JWT
app.set("secretKey", "nodeRestApi");

// Session
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
        store: MongoStore.create({
            mongoUrl: DB_URL,
        }),
    })
);

// Routing
app.use("/", router);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/user", userRoutes);

//Errors
app.use("*", (req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res
        .status(error.status || 500)
        .json(error.message || "Unexpected error");
});

// Server listen
server.listen(PORT || 5000, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
