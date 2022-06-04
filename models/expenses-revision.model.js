const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const SchemaTypes = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const ExpenseRevision = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    item:{
        type: String, ref: "Item",
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    details: {
        type : String,
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

ExpenseRevision.plugin(mongoosePaginate);

ExpenseRevision.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("ExpenseRevision", ExpenseRevision);