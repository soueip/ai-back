const mongoose = require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    }catch(error){
        console.error('Error connecting to the database:', error);
    }
}
module.exports=connectDB;
