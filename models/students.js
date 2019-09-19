let mongoose = require('mongoose');

let StudentsSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{
        "default": "student Name",
        "type": String,
        "required": true
    },
    userEmail:{
        "default": "student email",
        "type": String,
        "required": true
    },
    profile_image: {
        "default": "https://secure.meetupstatic.com/img/noPhoto_50.png",
        "type": String,
        "required": false
    },
    phone: {
        "default": "student phone",
        "type": String,
        "required": false
    },
    isAdmin: {
        "default": 0,
        "type":Number,
        "required": false
    },
    assistance:Array
})

module.exports = mongoose.model('Student',StudentsSchema)