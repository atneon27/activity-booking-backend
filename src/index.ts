import express from "express";
import authRouter from "./routes/authRoute.js";
import eventRouter from "./routes/eventRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import { connectToDB } from "./lib/mongo.js";

const app = express();

app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/bookings', bookingRouter)

app.listen(3000, async () => {
    console.log("Server is running on port 3000");
    await connectToDB();
})