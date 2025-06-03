const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();
const Auth = require('./Auth');
const db = require('./db');
const routes = require('./Routes');


app.use('/Task',routes);


app.use(bodyparser.json());
app.use(cors());
app.use(fileUpload())


//Logger Middleware
app.use((req , res , next) =>{
    console.log(`${req.method} ${req.originalURL}`);
    next()
})

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  }
  console.log('Connected to MySQL');
});


// Register API
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: 'User registered successfully' });
    });
  });

// Login API
app.post('/login', async (req , res) => {
    const {username , password} = req.body;
    const user = await db.execute('select * from users where username = ?'[username]);

    if(!username === user.username && !password === user.password){
        res.status(400).send("Invalid Credential")
    }
    const token = jwt.sign({id : user.id ,username : user.username}, Auth.JWT_SECRET , {expriresIn : '1hr'})
    res.json({Token : token})
})




const PORT = 3000;

app.listen(PORT , () => {
console.log(`Server Connected ${PORT}`);
})
