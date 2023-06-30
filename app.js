import express from "express";
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';

import homeRouter from "./routes/homePageRouter.js";
import reportRouter from './routes/report.js';
import loginRouter from './routes/loginRouter.js';


dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout","./layout/mainLayout.ejs");

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})

app.use("/", loginRouter);
app.use("/home", homeRouter);
app.use("/report", reportRouter);
// app.get("/get-token",(req,res)=>{
//   var token = process.env.token
//   res.json(token)
// })

app.use((req,res)=>{
  res.render("login",{can_access:"",error:""})
})



app.listen(4100, () => {
  console.log(`server is running on port 4100`);
});
