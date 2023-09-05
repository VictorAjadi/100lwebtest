var mongoose=require('mongoose');

var mth101Schema=new mongoose.Schema({
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
mth101Schema.index({ studentname: 1, course: 1 });
var mth101=mongoose.model('mth101',mth101Schema);

module.exports=mth101;