const jwt = require('jsonwebtoken')
// const jwtConfig = require('..config/jwtConfig')
const jwtConfig = require('../config/jwtConfig');

const dotenv = require('dotenv')

dotenv.config()
module.exports.auth = async(req,res,next)=>{

    try{
        const token = req.headers.authorization.split("Bearer ")[1];


        const decoded =jwt.verify(token,process.env.secret)
        console.log(decoded)

        
        req.auth=decoded
        return next()

    }catch(err){
        console.log(err)
        res.send('หนังหมาไอ้สัส ไปหา Token มาซะ!!!').status(500)

    }

}