import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import setupSocket from "../socket.js";
import {createServer} from "http"


dotenv.config({
    path: "./.env",
});
const port = process.env.PORT || 7272;

const httpServer = createServer(app)



connectDB()
    .then(() => {
        setupSocket(httpServer);
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
