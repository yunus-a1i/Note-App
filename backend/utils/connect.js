import mongoose from "mongoose";

const connection = {isConnected: null}

export const connectToDB = async() => {
    try {
        if(connection.isConnected){
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URL)
        connection.isConnected = db.connections[0].readyState;
        console.log('connected to db')
    } catch (error){
        console.log("Could'nt connect with database", error)
}
}