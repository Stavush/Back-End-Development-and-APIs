const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

//conect to DB 
mongoose.connect(process.env.MONGO_URL)

const exersiceSchema = new Schema({
  description: String,
  duration: Number,
  date: String
})

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  log: [exersiceSchema]
})

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exersiceSchema)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/users')
  // 2-3: creat a user when submmitimg a username
  .post((req, res) => {
    const username = req.body.username
    const user = new User({ username })
    user.save((err, data) => {
      if (err || !data){
        res.send("There's an error saving the user");
      }
      res.json(data);
    })
  })
  // 4-6: get list of users
  .get((req, res) => {
    User.find((err, users) => {
      if(!err){
        res.json(users);
      }
  })
})

// 7-8: add exercies to a user 
app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  const { description } = req.body;
  const duration = parseInt(req.body.duration);
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const newExercise = new Exercise({
    description: description,
    duration: duration,
    date: date.toDateString()
    })
  User.findByIdAndUpdate(id, {$push: {log: newExercise}}, {new: true}, (err, user) => {
    if(!user || err){
      res.send("Cannot find user");
    }
    else {
      newExercise.save((err, data) => {
        if(err){
          res.send("There's an error saving the exercise");
        }
        else {
        res.json({
          _id: id,
          username: user.username,
          description: newExercise['description'],
          duration: newExercise['duration'],
          date: newExercise['date']
        });
        }
      })
    }
  }) 
})

app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  const id = req.params._id;
  
  User.findById(id, (err, user) => {
    // 9-15: retrieve a full exercise log of any user
    if(err || !user){
      res.send("There's an error retrieving the exercise log");
    } else {
      let log = user.log;
      // 16: You can add from, to and limit parameters to a GET request to retrieve part of the log of any user
      if(from && to){
        log = log.filter(x =>  new Date(x.date).getTime() >= new Date(from).getTime() && new Date(x.date).getTime() <= new Date(to).getTime())
        console.log(log)
      } else if(from && !to){
        log = log.filter(x =>  new Date(x.date).getTime() >= new Date(from).getTime())
        console.log(log)
      } else if(!from && to){
        log = log.filter(x =>  new Date(x.date).getTime() <= new Date(to).getTime())
        console.log(log)
      }
      if (limit){
          log = log.slice(0, parseInt(limit));
        }
      
      let count = user.log.length;
      res.json({
        user: user.username,
        count,
        _id: id,
        log: log
        });
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
