var mongoose=require('mongoose');

var bio101Schema=new mongoose.Schema({
  course: String,
  studentname: String,
  department: String,
  score: Number,
  grade: String,
  ref_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
  question:[]
});
bio101Schema.index({ studentname: 1, course: 1 });
var bio101=mongoose.model('bio101',bio101Schema);

module.exports=bio101;