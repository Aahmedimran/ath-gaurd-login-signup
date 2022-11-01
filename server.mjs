import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const SECRET = process.env.SECRET || "topsecret";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],

    credentials: true,
  })
);

const port = process.env.PORT || 3001;
let dbURI =
  process.env.MONGOOSEDBURI ||
  "mongodb+srv://abc:abc@cluster0.olyure1.mongodb.net/socialmediaapp?retryWrites=true&w=majority";
mongoose.connect(dbURI);
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },

  age: { type: Number, min: 17, max: 65, default: 18 },
  isMarried: { type: Boolean, default: false },
  createOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model("User", userSchema);

// login code

app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password) {
    // null check - undefined, "", 0 , false, null , NaN
    res.status(400).send(
      `required fields missing, request example: 
              {
                  "email": "abc@abc.com",
                  "password": "12345"
              }`
    );
    return;
  }

  // check if user already exist // query email user
  userModel.findOne(
    { email: body.email },
    // { email:1, firstName:1, lastName:1, age:1, password:0 },
    "email firstName lastName age password",
    (err, data) => {
      if (!err) {
        console.log("data: ", data);

        if (data) {
          // user found
          varifyHash(body.password, data.password).then((isMatched) => {
            console.log("isMatched: ", isMatched);

            if (isMatched) {
              //  JWT token

              var token = jwt.sign(
                {
                  _id: data._id,
                  email: data.email,
                  iat: Math.floor(Date.now() / 1000) - 30,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                SECRET
              );

              console.log("token :", token);
              //token send on cookies
              res.cookie("token", token, {
                maxAge: 86_400_00,
                httpOnly: true,
              });

              res.send({
                message: "login successful",
                profile: {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  age: data.age,
                  _id: data._id,
                },
              });
              return;
            } else {
              console.log("user not found");
              res.status(401).send({ message: "Incorrect email or password" });
              return;
            }
          });
        } else {
          // user not already exist
          console.log("user not found");
          res.status(401).send({ message: "Incorrect email or password" });
          return;
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "login failed, please try later" });
        return;
      }
    }
  );
});

// =============
// logout code

app.post("/logout", (req, res) => {
  let body = req.body;

  res.cookie("token", '', {
    maxAge: 0,
    httpOnly: true,
  });

  res.send({
    message: "logout successful",
    

    
  });
    
  
})
 







//signup code
app.post("/signup", (req, res) => {
  let body = req.body;
  if (!body.firstName || !body.lastName || !body.email || !body.password) {
    res.status(400).send(
      `required field missing, request example :
    {
        firstName :"john"
        email  :"abd@abc.com
        lastName :"doe"
password :"12345"
    }`
    );
    return;
  }

  // check if user already exist // query email user

  userModel.findOne(
    { email: body.email },

    (err, data) => {
      if (!err) {
        console.log("data", data);

        if (data) {
          //user already exist
          console.log("user already exist :", data);
          res
            .status(400)
            .send({ message: "user already exist,,Please try deffrent email" });
          return;
        } else {
          //user not already exist

          stringToHash(body.password).then((hashString) => {
            userModel.create(
              {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email.toLowerCase(),
                password: hashString,
              },
              (err, result) => {
                if (!err) {
                  console.log("data saved:", result);
                  res.status(201).send({ message: "user is created" });
                } else {
                  console.log("db error: ", err);
                  res.status(500).send({ message: "internal server error" });
                }
              }
            );
          });
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "db error in query" });
        return;
      }
    }
  );
});




// middle ware
app.use(function (req, res, next) {
  console.log("req.cookies ", req.cookies.token);

  if (!req.cookies.token) {
    res.status(401).send("include http-only crediential with every request");

    return;
  }
  jwt.verify(req.cookies.token, SECRET, function (err, decodedData) { 
    
    if (!err) {
      console.log("decodedData :", decodedData);

      
      const nowDate = new Date().getTime() / 1000;
      

      if (decodedData.exp < nowDate) {
        //expire after 5 min (in milis)
        res.status(401).send("token expired");
      } else {
        // issue new token
        // var token = jwt.sign(
        //   {
        //     id: decodedData.id,
        //     name: decodedData.name,
        //     email: decodedData.email,
        //   },
        //   SERVER_SECRET
        // );
        // res.cookie("jToken", token, {
        //   maxAge: 86_400_00,
        //   httpOnly: true,
        // });

        console.log("token approved")
        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

//multiple users
app.get("/users", async (req, res) => {
  try {
    let allUser = await userModel.find({}).exec();
    res.send(allUser);
  } catch (error) {
    res.status(500).send({ message: "error getting sers" });
  }
}); 

// profile user
app.get("/profile", async (req, res) => {

  console.log("req.body.token:", req.body.token)
  try {
    let user = await userModel.findOne({ _id: req.body.token._id }).exec();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "error getting users" });
  }
});



// **************************************************************

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
// let dbURI = 'mongodb+srv://abc:abc@cluster0.xwbyne9.mongodb.net/socialMediaBase?retryWrites=true&w=majority';

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
