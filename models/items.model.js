const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const Item = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     Itemname: {
        type: String
    },
    countingUnit: {
        type: String
    },
    isExpense: {
        type: String
    },
    price: {
        type: Number,
        default: 0    
    }, 
    revision:{
       type: Number,
       default: 0
   },
   status: {
       type: Number,
       default: 0
   },
   timeStamp:{ 
       type : String,

   },
   groupId:{
       type : String,
       default: null
    },
   userId:{
    type: String, ref: "Manager",
    default: null
}
}, {

   versionKey: false // _v:0 is removed from document

});

Item.plugin(mongoosePaginate);

Item.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("Item", Item);