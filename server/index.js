import "./configs/loadEnv.js";
import express from "express";
import cors from "cors";
import { connect } from "./configs/db.js";
import router from "./routes/index.js";

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port, () => {
    connect();
    console.log(`server is running at port: ${port}`);
});