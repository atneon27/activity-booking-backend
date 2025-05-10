import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL!;

if(!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

let cached = (global as any).mongoose;

if(!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
    if(cached.conn) {
        console.log("Using cached connection");
        return cached.conn;
    }

    if(!cached.promise) {
        cached.promise = mongoose.connect(DATABASE_URL, {
            dbName: "activity-booking",
        });
    }

    cached.conn = await cached.promise;
    console.log("Connected to DB");
    return cached.conn;
}