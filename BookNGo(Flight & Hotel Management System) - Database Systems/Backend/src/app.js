// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connection from "./db/connection.js"

// const app = express();

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());

// // Routes import
// import userRouter from "./routes/user.routes.js";

// // Routes declaration
// app.use("/api/v1/users", userRouter);
// app.get('/', (req, res) => {
//     res.send('Server is running!'); // Response for root URL
// });

// export { app };



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Fallback for local development
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import hotelReservationRouter from "./routes/hotelReservation.routes.js";
import airlineRouter from "./routes/airline.routes.js";
import flightRouter from "./routes/flight.routes.js";
import flightReservationRouter from "./routes/flightReservation.routes.js";
import cancelledFlightReservationRouter from "./routes/cancelledFlightReservation.routes.js";
import cancelledHotelReservationRouter from "./routes/cancelledHotelReservation.routes.js";
import bundleRouter from "./routes/bundle.routes.js";
import bundleReservationRouter from "./routes/bundleReservation.routes.js";
import cancelledBundleReservationRouter from "./routes/cancelledBundleReservation.routes.js";


// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/hotelReservation", hotelReservationRouter);
app.use("/api/v1/airlines", airlineRouter);
app.use("/api/v1/flights", flightRouter);
app.use("/api/v1/flightReservation", flightReservationRouter);
app.use("/api/v1/cancelledFlightReservation", cancelledFlightReservationRouter);
app.use("/api/v1/cancelledHotelReservation", cancelledHotelReservationRouter);
app.use("/api/v1/cancelledBundleReservation", cancelledBundleReservationRouter);
app.use("/api/v1/bundleReservation", bundleReservationRouter);
app.use("/api/v1/bundle", bundleRouter);

// Export app
export { app };
