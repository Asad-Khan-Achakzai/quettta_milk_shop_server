const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const PaymentRevision = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    buyer:{
        type: String, ref: "Buyer",
        default: null
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
        type : String,
    },
    sale: {
        type : String,
    },
    unpaid: {
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

PaymentRevision.plugin(mongoosePaginate);

PaymentRevision.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("PaymentRevision", PaymentRevision);