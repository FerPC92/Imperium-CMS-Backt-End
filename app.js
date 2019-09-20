const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const cors = require('cors');
const fs = require('fs')
const colors = require('colors');

//para subir archivos del front en la todo
const  multipart  =  require('connect-multiparty');


const server = express();

server.use(bodyParser.json());
server.use(cors())
//para subir archivos del front en la todo
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' });
server.use(bodyParser.urlencoded({
    extended: true
}));


let CategoryCourse = require('./models/categoriesCourses');
let Place = require('./models/places');
let Teacher = require('./models/teachers');
let Student = require('./models/students');
let ActiveCourse = require('./models/courses');

let rawFile = fs.readFileSync('secrets.json')
const secrets = JSON.parse(rawFile)

mongoose.connect('mongodb://localhost/valirium', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw error
    console.log('conexion exitosa')

    server.post('/register', (req, res) => {
        console.log('eh recibido una peticion al endpoint / register ')
        if (req.body["userName"] != undefined && req.body["userPassword"] != undefined && req.body["userName"] != "" && req.body["userPassword"] != "") {
            let newTeacher = new Teacher({
                "_id": mongoose.Types.ObjectId(),
                "userName": req.body.userName,
                "userEmail": req.body.userEmail,
                "userPassword": req.body.userPassword,
                "profile_image": req.body.profile_image,
                "phone": req.body.phone,
                "isAdmin": req.body.isAdmin,
                "type": req.body.type,
            })
            Teacher.find((err, data) => {
                if (err) {
                    console.log(err)
                }
                //let dataComplete = JSON.parse(data)
                let dataComplete = data
                let flag = false
                let usernameData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["userEmail"] === dataComplete[i]["userEmail"]) {
                        usernameData = dataComplete[i]

                    }
                }
                if (usernameData != undefined) {
                    flag = true;
                    console.log("user already exist! please Login".red)
                    res.send({
                        "message": "User already exist! please Login"
                    })

                }

                if (flag === false) {

                    //genera hash
                    bcrypt.hash(req.body["userPassword"].toString(), 10, function (err, hash) {


                        newTeacher["userPassword"] = hash;



                        newTeacher.save((err, data) => {
                            if (err) {

                                res.send({
                                    "message": err,
                                    "error": 1
                                })
                            } else {

                                console.log("usuario registrado".green)
                                res.send({
                                    "message": "User created successfully!, you can log in now"
                                })
                            }
                        }) //end writefile
                    });

                } // end if !flag




            }) //end find

        } else {
            console.log("register incorrect".red)
            res.send({
                "message": "Parameters mustn't be empty"
            })
        }
    }) //end post 


    server.post('/login', (req, res) => {
        console.log('eh recibido una peticion al endpoint /login ')
        //compruebo que el mensaje llegue bien
        if (req.body["userEmail"] != undefined && req.body["userPassword"] != undefined && req.body["userEmail"] != "" && req.body["userPassword"] != "") {

            Teacher.find((err, data) => {
                if (err) {
                    console.log(err)
                } //log errors
                let dataComplete = data;
                let userData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["userEmail"] === dataComplete[i]["userEmail"]) {
                        userData = dataComplete[i]
                    }
                }
                if (userData != undefined) {
                    //check if password is correct. compare hash with the one in the users.json file
                    bcrypt.compare(req.body["userPassword"], userData["userPassword"], (err, result) => {
                        if (!result) {
                            console.log("Password incorrect".red);
                            res.send({
                                "message": "Login incorrect, please check it!"
                            })
                        } else {
                            //create token
                            jwt.sign({
                                "userEmail": userData["userEmail"]
                            }, secrets["jwtKey"], (err, token) => {
                                console.log("Login correct".green)
                                res.send({
                                    "message": "Login correct",
                                    "token": token,
                                    "userID": userData["_id"],
                                    "name": userData["userName"],
                                    "userEmail": userData["userEmail"],
                                    "profile_image": userData["profile_image"] ,
                                    "admin": userData["isAdmin"]
                                })
                            })
                        }

                    }) // end bcrypt

                } else {
                    console.log("user doesnt't exist".red)
                    res.send({
                        "message": "user doesnt't exist, please register"
                    })
                }
            }) //end readfile
        } else {
            console.log("Login incorrect".red)
            res.send({
                "message": "Fields must be complete!"
            })
        }

    })


    // CRUD TEACHERS
    server.get('/teachers', (req, res) => {
        Teacher.find((err, data) => {
            res.send(data)
        })
    })

    server.get('/teachers/:id', (req, res) => {
        Teacher.find({
            "_id": req.params.id
        }, (err, data) => {
            res.send(data)
        })
    })

    server.post('/createTeacher', (req, res) => {
        console.log('eh recibido una llamada al endpoint /createTeacher')
        if (req.body["userName"] != undefined && req.body["userEmail"] != undefined && req.body["userPassword"] != undefined && req.body["userName"] != "" && req.body["userEmail"] != "" && req.body["userPassword"] != "") {
            let newTeacher = new Teacher({
                "_id": mongoose.Types.ObjectId(),
                "userName": req.body.userName,
                "userEmail": req.body.userEmail,
                "userPassword": req.body.userPassword,
                "profile_image": req.body.profile_image,
                "phone": req.body.phone,
                "isAdmin": req.body.isAdmin,
                "type": req.body.type,
                "todo":req.body.todo
            })

            Teacher.find((err, data) => {
                if (err) {
                    console.log(err)
                }
                let dataComplete = data
                let flag = false
                let teacherData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["userEmail"] === dataComplete[i]["userEmail"]) {
                        teacherData = dataComplete[i]

                    }
                }
                if (teacherData != undefined) {
                    flag = true;
                    console.log("Teacher already exist!".red)
                    res.send({
                        "message": "Teacher already exist! please check it"
                    })

                } else {

                    newTeacher.save((err) => {
                        if (err) throw err
                        res.send({
                            "message": "Teacher Created Succesfully"
                        })
                    });
                }
            })



        } else {
            res.send({
                "message": "Missing parameters"
            })
        }
    })

    server.put('/modTeacher', (req, res) => {
        console.log('eh recibido una llamada al endpoint /modTeacher')
        let query = {
            "_id": req.body._id
        }

        let datosFinales = req.body
        let update = {
            $set: datosFinales
        }
        let options = {
            multi: true
        }

        Teacher.updateOne(query, update, options, (err, log) => {
            if (err) {
                res.send({
                    "message": "the Teacher doesn't exist, please check it"
                })
            } else {
                res.send({
                    "message": "Successfully modified Teacher"
                })
            }
        })
    })

    server.delete('/deleteTeacher/:id', (req, res) => {
        console.log('eh recibido una llamada al endpoint /deleteTeacher')
        Teacher.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            res.send({
                "message": "Teacher deleted"
            })

        })
    })


    //crud places
    server.get('/places', (req, res) => {
        Place.find((err, data) => {
            res.send(data)
        })
    })

    server.get('/places/:id', (req, res) => {
        Place.find({
            "_id": req.params.id
        }, (err, data) => {
            res.send(data)
        })
    })


    server.post('/createPlace', (req, res) => {
        console.log('eh recibido una llamada al endpoint /createPlace')
        if (req.body["place"] != undefined && req.body["place"] != "") {
            let newPlace = new Place({
                "_id": mongoose.Types.ObjectId(),
                "place": req.body.place,
            })

            Place.find((err, data) => {
                if (err) {
                    console.log(err)
                }
                let dataComplete = data
                let flag = false
                let placesData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["place"] === dataComplete[i]["place"]) {
                        placesData = dataComplete[i]

                    }
                }
                if (placesData != undefined) {
                    flag = true;
                    console.log("Place already exist!".red)
                    res.send({
                        "message": "Place already exist! please check it"
                    })

                } else {

                    newPlace.save((err) => {
                        if (err) throw err
                        res.send({
                            "message": "Place Created Succesfully"
                        })
                    });
                }
            })

        } else {
            res.send({
                "message": "Missing parameters"
            })
        }
    })

    server.delete('/deletePlace/:id', (req, res) => {
        console.log('eh recibido una llamada al endpoint /deleteTeacher')
        Place.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            res.send({
                "message": "Place deleted"
            })

        })
    })

    //CRUD CATEGORYES
    server.get('/courseCategory', (req, res) => {
        CategoryCourse.find((err, data) => {
            res.send(data)
        })
    })

    server.get('/courseCategory/:id', (req, res) => {
        CategoryCourse.find({
            "_id": req.params.id
        }, (err, data) => {
            res.send(data)
        })
    })


    server.post('/createCategoryCourse', (req, res) => {
        console.log('eh recibido una llamada al endpoint /createCategoryCourse')
        if (req.body["name"] != undefined && req.body["name"] != "") {
            let newCategory = new CategoryCourse({
                "_id": mongoose.Types.ObjectId(),
                "name": req.body.name,
            })

            CategoryCourse.find((err, data) => {
                if (err) {
                    console.log(err)
                }
                let dataComplete = data
                let flag = false
                let categoryData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["name"] === dataComplete[i]["name"]) {
                        categoryData = dataComplete[i]

                    }
                }
                if (categoryData != undefined) {
                    flag = true;
                    console.log("Category already exist!".red)
                    res.send({
                        "message": "Category already exist! please check it"
                    })

                } else {

                    newCategory.save((err) => {
                        if (err) throw err
                        res.send({
                            "message": "Category Created Succesfully"
                        })
                    });
                }
            })

        } else {
            res.send({
                "message": "Missing parameters"
            })
        }
    })

    server.delete('/deleteCategoryCourse/:id', (req, res) => {
        console.log('eh recibido una llamada al endpoint /deleteCategoryCourse')
        CategoryCourse.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            res.send({
                "message": "Category deleted"
            })

        })
    })

    // CRUD STUDENTS
    server.get('/students', (req, res) => {
        Student.find((err, data) => {
            res.send(data)
        })
    })

    server.get('/students/:id', (req, res) => {
        Student.find({
            "_id": req.params.id
        }, (err, data) => {
            res.send(data)
        })
    })

    server.post('/createStudent', (req, res) => {
        console.log('eh recibido una llamada al endpoint /createStudent')
        if (req.body["userName"] != undefined && req.body["userEmail"] != undefined &&  req.body["userName"] != "" &&  req.body["userEmail"] != "") {
            let newStudent = new Student({
                "_id": mongoose.Types.ObjectId(),
                "userName": req.body.userName,
                "userEmail": req.body.userEmail,
                "profile_image": req.body.profile_image,
                "phone": req.body.phone,
                "isAdmin": req.body.isAdmin,
                "assistance" : req.body.assistance
            })

            Student.find((err, data) => {
                if (err) {
                    console.log(err)
                }
                let dataComplete = data
                let flag = false
                let studentData;
                for (let i = 0; i < dataComplete.length; i++) {
                    if (req.body["userEmail"] === dataComplete[i]["userEmail"]) {
                        studentData = dataComplete[i]

                    }
                }
                if (studentData != undefined) {
                    flag = true;
                    console.log("Student already exist!".red)
                    res.send({
                        "message": "Student already exist! please check it"
                    })

                } else {

                    newStudent.save((err) => {
                        
                        if (err) throw err
                        res.send({
                            "message": "Student Created Succesfully",
                            "student" : newStudent
                        })
                    });
                }
            })



        } else {
            res.send({
                "message": "Missing parameters"
            })
        }
    })

    server.put('/modStudent', (req, res) => {
        console.log('eh recibido una llamada al endpoint /modTeacher')
        let query = {
            "_id": req.body._id
        }

        let datosFinales = req.body
        let update = {
            $set: datosFinales
        }
        let options = {
            multi: true
        }

        Student.updateOne(query, update, options, (err, log) => {
            if (err) {
                res.send({
                    "message": "the Student doesn't exist, please check it"
                })
            } else {
                res.send({
                    "message": "Successfully modified Student"
                })
            }
        })
    })

    server.delete('/deleteStudent/:id', (req, res) => {
        console.log('eh recibido una llamada al endpoint /deleteStudent')
        Student.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            res.send({
                "message": "Student deleted"
            })

        })
    })



    // CRUD ACTIVE COURSES
    server.get('/courses', (req, res) => {
        ActiveCourse.find((err, data) => {
            res.send(data)
        })
    })

    server.get('/courses/:id', (req, res) => {
        ActiveCourse.find({
            "_id": req.params.id
        }, (err, data) => {
            res.send(data)
        })
    })

    server.post('/createCourse', (req, res) => {
        console.log('eh recibido una llamada al endpoint /createCourse')
        if (req.body["courseStartDay"] != undefined && req.body["courseStartDay"] != "" && req.body["courseEndDay"] != undefined && req.body["courseEndDay"] != "" && req.body["courseDuration"] != undefined && req.body["courseDuration"] != "" ) {
            let newCourse = new ActiveCourse({
                "_id": mongoose.Types.ObjectId(),
                "courseStartDay": req.body.courseStartDay,
                "courseEndDay": req.body.courseEndDay,
                "courseDuration": req.body.courseDuration,
                "courseModality": req.body.courseModality,
                "courseTime": req.body.courseTime,
                "courseCategory": req.body.courseCategory,
                "students": req.body.students,
                "teachers": req.body.teachers,
                "place": req.body.place
            })

                    newCourse.save((err) => {
                        if (err) throw err
                        res.send({
                            "message": "Course Created Succesfully"
                        })
                    });

        } else {
            res.send({
                "message": "Missing parameters"
            })
        }
    })

    server.put('/modCourse', (req, res) => {
        console.log('eh recibido una llamada al endpoint /modCourse')
        let query = {
            "_id": req.body._id
        }

        if(query["_id"] === undefined){
            res.send({"message": "missing id parameter"})
        } else{

            let datosFinales = req.body
            let update = {
                $set: datosFinales
            }
            let options = {
                multi: true
            }

            ActiveCourse.updateOne(query, update, options, (err, log) => {
                if (err) {
                    res.send({
                        "message": "the Course doesn't exist, please check it"
                    })
                } else {
                    res.send({
                        "message": "Successfully modified Course"
                    })
                }
            })


        }
    })

    server.delete('/deleteCourse/:id', (req, res) => {
        console.log('eh recibido una llamada al endpoint /deleteCourse')
        ActiveCourse.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            res.send({
                "message": "Course deleted"
            })

        })
    })


    //para subir archivos del front en la todo
    server.get('/api/upload', (req, res) => {
        res.json({
            'message': 'hello'
        });
    });

    server.post('/api/upload', multipartMiddleware, (req, res) => {
        //console.log(req.body, req.files);
        let file = req.files.uploads[0];
        console.log(file)
        console.log("The file was saved!");

        res.json({
            'message': 'File uploaded successfully',
            'path': file,

        });
    });



    server.listen(3000, () => {
        console.log('escuchando en 3000')
    })


}) //end mongoose