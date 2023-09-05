var mongoose=require('mongoose');

var gns101Schema=new mongoose.Schema({
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
gns101Schema.index({ studentname: 1, course: 1 });
var gns101=mongoose.model('gns101',gns101Schema);

module.exports=gns101;