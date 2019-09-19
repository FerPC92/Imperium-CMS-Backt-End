let mongoose = require('mongoose');

let TeachersSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{
        "default": "teacher Name",
        "type": String,
        "required": true
    },
    userEmail:{
        "default": "teacher email",
        "type": String,
        "required": true
    },
    userPassword:{
        "default": "teacher password",
        "type": String,
        "required": true
    },
    profile_image: {
        "default": "https://secure.meetupstatic.com/img/noPhoto_50.png",
        "type": String,
        "required": false
    },
    phone: {
        "default": "teacher phone",
        "type": String,
        "required": false
    },
    isAdmin: {
        "default": 0,
        "type":Number,
        "required": false
    },
    type:{
        "default": "Head Teacher",
        "type": String,
        "required": false
    },
    todo:Array

})

module.exports = mongoose.model('Teacher',TeachersSchema)