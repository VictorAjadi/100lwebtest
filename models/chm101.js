var mongoose=require('mongoose');

var chm101Schema=new mongoose.Schema({
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
chm101Schema.index({ studentname: 1, course: 1 });
var chm101=mongoose.model('chm101',chm101Schema);

module.exports=chm101;