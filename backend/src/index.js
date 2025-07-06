import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import setupSocket from "../socket.js";
import {createServer} from "http"
import path from "path";
const __dirname = path.resolve();

dotenv.config({
    path: "./.env",
});
const port = process.env.PORT || 7272;

const server = createServer(app)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    });
}

connectDB()
    .then(() => {
        setupSocket(server);
        server.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });
        server.on("error", (error) => {
            console.error("Server Error:", error);
            throw error;
        });
        
    })
    .catch((err) => {
        console.log("MONGO db connecton failed : ", err);
    });
