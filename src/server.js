require("dotenv").config();
const express =require("express");
const cookieParser = require("cookie-parser")
const bodyParser =require ("body-parser");
const cors =require ("cors");
const path =require ("path");
const fileUpload =require ("express-fileupload");
const app = express();
const fs = require ("fs");
const routes =require ("./router/routes");


app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
  })
);

app.use(cors());


app.use(routes);

app.listen(3001);
