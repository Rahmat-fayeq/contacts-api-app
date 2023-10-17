require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');

 const port = process.env.PORT || 5000;
 connectDB();   
 const app = express();
  app.use(express.json()); 
  app.use('/api/contacts',require('./routes/contactRoutes'));
  app.use('/api/users',require('./routes/userRoutes'));
  app.all('*',(req,res)=>{
    res.status(404);
    throw new Error("Route not found");
  });
  app.use(errorHandler);  
  app.listen(port,()=>{
    console.log(`Server started & listening on ${port}`);
  });