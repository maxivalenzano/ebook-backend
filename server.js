const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

global.__basedir = __dirname;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//const Role = db.role;
//const UserController = require("./app/controllers/tutorial.controller");
// console.log("------------------")
// console.log("------------------")
// console.log("------------------")
// const TagController = require("./app/controllers/user.controller");
// const run = async () => {
//   await TagController.addEbook(1, 1);
// // >> added Tutorial id=1 to Tag id=1

// await TagController.addEbook(1, 2);
// // >> added Tutorial id=2 to Tag id=1

// await TagController.addEbook(1, 3);
// // >> added Tutorial id=3 to Tag id=1

// await TagController.addEbook(2, 2);
// // >> added Tutorial id=3 to Tag id=2

// await TagController.addEbook(2, 3);
// // >> added Tutorial id=4 to Tag id=2

// await TagController.addEbook(2, 4);
// // >> added Tutorial id=1 to Tag id=2
// await TagController.addEbook(3, 5);

// const user1 = await TagController.findById(1);
// console.log(JSON.stringify(user1, null, 2));
// };
// console.log("------------------")
// console.log("------------------")
// console.log("------------------")

db.sequelize.sync(
//    {force: true}).then(() =>{
//    console.log('Drop and Resync DB');
//      run()
//}
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to eBookStore application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/ebook.routes")(app);
require("./app/routes/file.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




//function initial() {


//   Role.create({
//     id: 1,
//     name: "user"
//   });
 
//   Role.create({
//     id: 2,
//     name: "moderator"
//   });
 
//   Role.create({
//     id: 3,
//     name: "admin"
//   });
//}