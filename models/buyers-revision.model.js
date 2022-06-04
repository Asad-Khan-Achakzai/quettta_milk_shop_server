const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const moment = require('moment');  
const BuyersRevision = new Schema({
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
    type: {
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

BuyersRevision.plugin(mongoosePaginate);

BuyersRevision.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("BuyersRevision", BuyersRevision);