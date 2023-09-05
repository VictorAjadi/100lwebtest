var mongoose=require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema=new mongoose.Schema({
    studentName: String,
    password: String,
    department: String,
    isAdmin: Boolean
});

userSchema.plugin(passportLocalMongoose);
var user=mongoose.model('user',userSchema);

module.exports=user;