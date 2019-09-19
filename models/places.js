let mongoose = require('mongoose');

let PlacesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    place:{
        "default": "Barcelona",
        "type": String,
        "required": true
    }
    
})

module.exports = mongoose.model('Place',PlacesSchema)