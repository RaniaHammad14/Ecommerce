import mongoose from "mongoose"

const connection = async ()=>{
    return await mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        console.log("Connected to Database");
      })
      .catch((err) => {
        console.log("Failed to connect to Database", err);
      });
}

export default connection;
