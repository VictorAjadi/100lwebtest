var mongoose=require('mongoose');

var questionDataSchema=new mongoose.Schema({
course: String,
question: String,
optionA: String,
optionB: String,
optionC: String,
optionD: String,
answer: String,
score: String
})


var questionData=mongoose.model('questionData',questionDataSchema);

module.exports=questionData;