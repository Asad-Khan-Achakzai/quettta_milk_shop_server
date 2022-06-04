const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const itemReport = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    item:{
        type: String, ref: "Item",
        default: null
    },
    timeStamp:{ 
        type : String,
    }
}, {

    versionKey: false // _v:0 is removed from document

});

itemReport.plugin(mongoosePaginate);
itemReport.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }
module.exports = mongoose.model("itemReport", itemReport);