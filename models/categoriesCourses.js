let mongoose = require('mongoose');

let categoriesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        "default": "FS/DS/UX",
        "type": String,
        "required": true
    }
    
})

module.exports = mongoose.model('CategoryCourses',categoriesSchema)