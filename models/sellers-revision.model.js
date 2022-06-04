const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const SellersRevision = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },
    address: {
        type: String
    },
    mobileN: {
        type: Number
    },
    phoneN: {
        type: Number
    },
    otherN: {
        type: Number
    },
    milkPrice: {
        type: Number
    },
    yougurtPrice: {
        type: Number
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
     },
}, {

    versionKey: false 

});

SellersRevision.plugin(mongoosePaginate);

SellersRevision.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("SellersRevision", SellersRevision);