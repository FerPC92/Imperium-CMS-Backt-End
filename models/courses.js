let mongoose = require('mongoose');

let CoursesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    courseCategory:Object,
    place:Object,
    courseStartDay:{
        "default": new Date(),
        "type": Date,
        "required": true
    },
    courseEndDay:{
        "default": new Date(),
        "type": Date,
        "required": true
    },
    courseDuration:{
        "default": 93,
        "type": Number,
        "required": true
    },
    courseModality:{
        "default": "Full Time",
        "type": String,
        "required": false
    },
    courseTime:{
        "default": "09 to 18",
        "type": String,
        "required": false
    },
    teachers:Array,
    students:Array
})

module.exports = mongoose.model('Course',CoursesSchema)