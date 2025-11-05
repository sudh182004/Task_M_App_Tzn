import mongoose from "mongoose";

function dbConnection(){
    mongoose.connect(process.env.MONGO_URI)
        
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ DB connection error:", err));      

}
export default dbConnection;