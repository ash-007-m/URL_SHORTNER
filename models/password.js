const mongoose=require('mongoose')
const passwordSchema=new mongoose.Schema(
{
name:{ type:String,require:true },
password:{type:String,require:true},
} 
)
module.exports = mongoose.model('password',passwordSchema)