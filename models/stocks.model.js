const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Stock = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     venderName: {
        type: String
    },
     itemName: {
        type: String
    },
    itemsQuantity: {
        type: Number
    }
});

Stock.plugin(mongoosePaginate);

Stock.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
module.exports = mongoose.model("Stock", Stock);