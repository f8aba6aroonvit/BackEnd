const express = require('express');
const dotenv = require('dotenv')
const app = express.Router();
const bcrypt = require('bcrypt');
const mySqlPool = require('../model/database')
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');


dotenv.config()
app.post('/register',async (req,res)=>{
    const {username,password,email,role} = req.body

    console.log(req.body)
    if(!username||!password||!email||!role){
        return res.status(400).send({message:"กรุณากรอกข้อมูลของท่านให้ครบ"})
    }

    try{
        const [existingUser] = await mySqlPool.query('SELECT * FROM users WHERE username = ?',[username])
        const [existingEmail] = await mySqlPool.query('SELECT * FROM users WHERE email = ?',[email])
        if (existingUser.length > 0) {
            return res.status(400).send({message: 'มีผู้ใช้นี้ในระบบอยู่แล้ว'});
        }

        if (existingEmail.length > 0) {
            return res.status(400).send({message: 'อีเมลล์นี้มีในระบบอยู่แล้ว'});
        }


        // const [existingEmail] =await mySqlPool.query('SELECT ')
        const hashedPassword = await bcrypt.hash(password, 10);

        await mySqlPool.query('INSERT INTO users (username, password,email,role) VALUES (?, ?, ?,?)',[username,hashedPassword,email,role]);

        res.status(201).send({ message: `สมัครข้อมูลผู้ใช้ ${username} ด้วยอีเมล ${email} ใน ${role} สำเร็จ` });

    }catch(error){

        res.status(500).send({ message: 'หนังหมาว่ะ' });

    }
})
    
app.post('/login',async (req,res)=>{
    const {username,password} = req.body
        if(!username||!password){
            return res.status(400).send({
                success : false ,
                message: "กรุณากรอกข้อมูลของท่านให้ครบ"
            })
        }
    try{
        
        const [user] = await mySqlPool.query('SELECT * FROM users WHERE username = ?', [username])
        console.log([user])
        if (user.length === 0) {
            return res.status(401).send({ message: 'กรุณากรอกข้อมูลผู้ใช้ให้ถูกต้อง' });
          }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).send({ message: 'รหัสผ่านของท่านไม่ถูกต้อง' });
        }

        const token = jwt.sign(
            { id: user[0].id,
             username: user[0].username,
             email:user[0].email ,
             role:user[0].role}, 
            
             process.env.secret, 
             {
            expiresIn: process.env.expiresIn,
        });
      
        res.status(200).send({ message: 'Login successful', token });
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"หนังหมาว่ะ"
        })
    }
})

module.exports = app