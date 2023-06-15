require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3001;
const routes = require("./router/routes");

app.use(session({ secret: process.env.SECRET }));
app.use(bodyParser.json());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
  })
);
app.use(cors());

app.use((req, res, next) => {
  res.locals.msg_sucess = req.flash("msg_sucess");
  res.locals.msg_none = req.flash("msg_none");
  res.locals.msg_error = req.flash("msg_error");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(routes);

app.listen(port, () => {
  console.log(`Link http://localhost:${port}`);
});
