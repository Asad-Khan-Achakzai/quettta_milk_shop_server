const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const Purchase = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    seller:{
        type: String, ref: "Seller",
        default: null
    },
    item:{
        type: String, ref: "Item",
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
    payment: {
        type: String
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

Purchase.plugin(mongoosePaginate);

Purchase.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("Purchase", Purchase);