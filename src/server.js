require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const user = require('./router/userRoute');
const home = require('./router/home');
const inventario = require('./router/inventario')

var path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3001;

app.use(session({ secret: process.env.SECRET }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));
app.use(cors());


app.listen(port, () => {
    console.log(`Link http://localhost:${port}`);
});


app.use('/list', user);
app.use('/home', home);
app.use('/inventario', inventario);