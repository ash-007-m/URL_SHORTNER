
const mongoose=require('mongoose')
const shortId=require('shortid')

const surlSchema=new mongoose.Schema(
{
full:{ type:String,require:true },
Shorturl:{type:String,require:true,default: shortId.generate},
note:{type:String},
username:{type:String,require:true}
} 
)
module.exports = mongoose.model('surls',surlSchema)