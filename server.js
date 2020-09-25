const path = require('path');
const express = require('express');
const dotenv = require('dotenv'); //create global variables: port, url
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/db');

dotenv.config({path:'./config/config.env'});
const transactions = require('./routes/transactions');

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json()); //allow us to use body parser
app.use('/api/v1/transactions',transactions);

//If in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build')); //Serves the static files

    //Entry to react app, default route
    app.get('*',(req,res) => res.sendFile(path.resolve(__dirname,'client','build',
    'index.html')));
}


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
