const express=require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const dotenv = require('dotenv').config()
const passport = require('./config/passport')



// dotenv.config({path: './config.env'});

const app=express()

//middleware

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//session handling
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge:72*60*60*1000
     }
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// using flash middleware
app.use(flash())

// Middleware to make flash messages accessible in views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


//set EJS ss the template engine
app.set('view engine', 'ejs')  
app.set('views',path.join(__dirname, 'views'));

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI,   
    ).then(()=>{
        console.log('Database connected')
    }).catch((err)=>{
        console.log('Database connection failed',err);      
    });


// importing user routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)

//importing admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)



const port = process.env.PORT || 3001
app.listen(port,()=>console.log('server is running http://localhost:3001'))