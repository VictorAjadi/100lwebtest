var mongoose=require('mongoose');

var phy101Schema=new mongoose.Schema({
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
phy101Schema.index({ studentname: 1, course: 1 });
var phy101=mongoose.model('phy101',phy101Schema);

module.exports=phy101;