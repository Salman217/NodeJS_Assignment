const express = require('express');
const TaskRoutes = express.Router();
const auth = require('./Auth');
const db = require('./db');
const excell = require('xlsx');


// Chats Imported API
TaskRoutes.post('/chats',auth.authenticateToken,async (req, res) => {

     if(!req.file){
        res.status(400).json({message : "No file uploaded"})
     }

     const file = req.file;
     const readFile = excell.read(file.data, {type : buffer});
     const sheet = readFile.Sheets(readFile.SheetNames[0]);
     const data = xlsx.utils.sheet_to_json(sheet);

     for(const row of data){
        if(!row.message || row.timestamp){
            const Insertvalues = await db.execute('Insert into chats (id,message,timestamp) values (?,?,?)'[req.userid,row.message,row.timestamptamp]);
        }
     }
     res.status(200).json({message : "Chat Imported"})

})


// Fetch Task API 
TaskRoutes.get('/fetchTask',auth.authenticateToken,async (req,res) => {
    const status= req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const [params] = [req.user.id];

    if(status === 'completed' || status === 'Pending'){
        query += 'AND status = ?';
        params.push(status)
    }

    const tasks = await db.execute(query , params);
    res.json({data : tasks})

} )


  module.exports = TaskRoutes;