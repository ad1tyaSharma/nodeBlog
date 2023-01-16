const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config()
const flash = require('connect-flash');

const MongoDBURI = process.env.MONGO_URI;

mongoose.connect(MongoDBURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("DB Connected");
});
app.use(flash());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    // store: new MongoStore({
    //     mongooseConnection: db
    // })
}));
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + 'public'));

//Router import
app.use("/posts", require("./routes/post"));
app.use("/users", require('./routes/user'))

app.get('/', (req, res) => {
    res.redirect('/posts')
})


app.use((req, res, next) => {
        res.status(404).send("Sorry can't find that!")
    })
    //Models import
require("./models/post");
require('./models/user')
app.use(express.json());

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
    console.log('Express app listening on port 3000');
});