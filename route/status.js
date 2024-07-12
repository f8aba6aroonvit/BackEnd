const express = require('express');
const app = express();


app.get('/stat',async(req,res)=>{

    try{
        const [stat] = await mySqlPool.query('SELECT * FROM status')
        res.status(200).send(stat);

    }catch(err){

    }
})



module.exports = app