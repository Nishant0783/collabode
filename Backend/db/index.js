import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MongoDB Connected!! DB HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Mongo connection Error", error);
        process.exit(1);
    }
};
export default connectDB;