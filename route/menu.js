const express = require('express');
const dotenv = require('dotenv')
const app = express.Router();
const bcrypt = require('bcrypt');
const mySqlPool = require('../model/database')
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const {auth} =require('../middleware/auth')







app.get('/user',auth,async(req,res)=>{
  try{
      const [user] = await mySqlPool.query('SELECT id,username,email,role FROM users')
      res.status(200).json(user);
    } 
    catch(err) {
      console.error(err)
    }
  
})
app.get('/user/:id',async (req,res)=>{
  const userId = req.params.id;
  try {
        const [user] = await mySqlPool.query('SELECT id, username,email,role FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
          return res.status(404).json({ message: 'ไม่พบชื่อผู้ใช้' });
        }
        res.status(200).send(user[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'หนังหมาไอ้สัส' });
      }
    });

app.put('/user/:id',async (req,res)=>{
    const userID = req.params.id
    const userN = req.body.username
    const passU = req.body.password
  try{
    

    const hashedPassword = await bcrypt.hash(passU, 10);
    const [user] =await mySqlPool.query(`SELECT * FROM users WHERE id=?`,[userID])
    if(user.length === 0){
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    const editUser = `UPDATE users SET username =?,password = ? WHERE id = ?`
    await mySqlPool.query(editUser, [userID]);
    res.status(200).json('อัพเดทข้อมูลผู้ใช้สำเร็จ')

  }catch(err){
    console.error(err)
    res.status(500).json({ message: 'หนังหมาไอ้สัส' });

  }
})




app.delete('/user/:id',auth,async(req,res)=>{
  const userID = req.params.id
  const userN = req.body.username
  console.log("เช็คชื่อ",userN)
  console.log("เช็คไอดี",userID)

  

  try{
    
    const [user] = await mySqlPool.query(`SELECT * FROM users WHERE id = ?`,[userID])
    console.log(user)

    if(user.length === 0){
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    
    const deleteUser= `DELETE FROM users WHERE id = ?`

    await mySqlPool.query(deleteUser, [userID]);
    res.status(200).json({ message: `ลบข้อมูล ${userN} สำเร็จ` });

  }catch(err){
    console.error(err)
    res.status(500).json({ message: 'หนังหมาไอ้สัส' });

  }

    
    
})


module.exports = app