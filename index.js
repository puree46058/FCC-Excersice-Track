const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://puree14885:S7tiBjgmrJ3qvlNY@cluster0.gbphcyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  const userSchema = mongoose.Schema({
    username:String,
  },);

  let User = mongoose.model('User',userSchema);

  const ExcerciseSchema = mongoose.Schema({
  user_id:{type:String,required:true},
  description:String,
  duration:Number,
  date:Date,
  });

  let Excersise = mongoose.model('Excersise',ExcerciseSchema);


app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users',async (req, res) => {
  
const user = await User.find({}).select("_id username");
if(!user){
  res.send("No user");
}else{
  res.json(user);
}

});

//post 
app.post('/api/users',async(req,res)=>{
 
  let userObj=new User({
    username:req.body.username
  })
  try{
    let user = await userObj.save()
    res.json(user)
  }catch(err){
    console.log(err)
  }
 
  
})

app.post('/api/users/:_id/exercises',async(req,res)=>{
 
  const id =req.params._id;
  const {description,duration,date}=req.body;
  
  try{
    const user=await User.findById(id)
    if(!user){
      res.send("Not Find User")
    }else{
      const excerciseObj = new Excersise({
        user_id:user._id,
        description,
        duration,
        date:date ? new Date(date) : new Date()
      })
      const exercises=await excerciseObj.save()
      res.json({
        _id:user._id,
        username:user.username,
        description:exercises.description,
        duration:exercises.duration,
        date:new Date(exercises.date).toDateString()

      })
    }
  }catch(err){
    console.log(err);
    res.send("Not Saveing Exercise")
  }

})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
