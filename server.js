const express = require('express')
const app = express()

const cors= require('cors')
const mysql = require('mysql2')
const dotenv = require('dotenv')

const PORT = process.env.DB_PORT || 3000
const NAME = process.env.DB_NAME

dotenv.config()
const morgan = require('morgan');
const path = require('path');

var userRouter = require('./route/login');
var statRouter = require('./route/status');
var playRouter =require('./route/menu')
const mySqlPool = require('./model/database')
const bodyParser = require('body-parser');

app.use(morgan('dev'));


app.get('/test',(req,res)=>{
  res.status(200).send("<h1>สวัสดีครับบบบบ</h1>")
  console.log("bobo")
})




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRouter);
app.use('/stat',statRouter);
app.use('/play',playRouter)

app.use(cors())


mySqlPool
.query('SELECT 1')
.then(()=>{
  console.log('MySQL Build UP!!!!')
  console.log(`Database Name ${process.env.DB_NAME}`)

  app.listen(PORT, () => {
    console.log(`เข้าที่หน้า URL http://localhost:${process.env.DB_PORT}`)
  })
}).catch((error)=>{
  console.log(error)
})

module.exports = app;