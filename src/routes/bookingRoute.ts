import express, { Router } from "express"; 
import { CustomRequest, EventQuerySchema, EventQueryType } from "../types/types.js";
import { Booking } from "../models/bookingSchema.js";
import authMiddleware from "../middleware/middleware.js";

const router = Router();

router.use(authMiddleware)

router.get('/', async (req: CustomRequest, res) => {
    try {
        const userId = req.userId

        if(!userId) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Invalid Data Passed"
            });
            return;
        }

        if(req.query.eventId) {
            const parsedQuery = EventQuerySchema.safeParse(req.query);

            if(!parsedQuery.success) {
                res.status(400).json({
                    msg: null,
                    data: null,
                    error: parsedQuery.error?.issues
                });
                return;
            }

            const query: EventQueryType = parsedQuery.data;
            
            const bookings = await Booking.findOne({
                user: userId,
                event: query.eventId
            }).populate("event");
    
            res.status(200).json({
                msg: "Bookings Retrieved",
                data: {
                    bookingId: bookings?._id,
                    event: {
                        eventId: bookings?.event._id,
                        title: (bookings?.event as any).title,
                        description: (bookings?.event as any).description,
                        location: (bookings?.event as any).location,
                        eventTime: (bookings?.event as any).eventTime,
                        createdOn: (bookings?.event as any).createdOn
                    }
                },
                error: null
            });
            return;
        }

        const bookings = await Booking.find({
            user: userId
        }).populate("event");

        const formatedBookings = bookings.map((booking) => {
            return {
                bookingId: booking._id,
                event: {
                    eventId: booking?.event._id,
                    title: (booking?.event as any).title,
                    description: (booking?.event as any).description,
                    location: (booking?.event as any).location,
                    eventTime: (booking?.event as any).eventTime,
                    createdOn: (booking?.event as any).createdOn
                }
            }
        });

        res.status(200).json({
            msg: "Bookings Retrieved",
            data: formatedBookings,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        })
    }
});

router.put('/', express.json(), async (req: CustomRequest, res) => {
    try {
        const userId = req.userId;
        const parsedQuery = EventQuerySchema.safeParse(req.query);

        if(!userId || !parsedQuery.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: !parsedQuery.success ? "No Event provided to Update Bookings under given User" : "Invalid Data Passed"
            });
            return;
        }

        const query: EventQueryType = parsedQuery.data;

        const uniqueBooking = await Booking.findOne({
            user: userId,
            event: query.eventId
        });

        if(!uniqueBooking) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Booking Does Not Exist"
            });
            return;
        }

        const bookings = await Booking.findOne({
            user: userId,
            event: query.eventId
        });

        res.status(200).json({
            msg: "Booking Updated",
            data: bookings?._id,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        })
    }
});

router.post('/', express.json(), async (req: CustomRequest, res) => {
    try {
        const userId = req.userId;
        const parsedQuery = EventQuerySchema.safeParse(req.query);

        if(!userId || !parsedQuery.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: !parsedQuery.success ? "No Event provided to Book under given User" : "Invalid Data Passed"
            });
            return;
        }

        const query: EventQueryType = parsedQuery.data;

        const uniqueBooking = await Booking.findOne({
            user: userId,
            event: query.eventId
        });

        if(!!uniqueBooking) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Booking Already Exists! Duplicate Booking Not Allowed"
            });
            return;
        }

        const bookings = await Booking.create({
            user: userId,
            event: query.eventId
        });

        res.status(201).json({
            msg: "Booking Created",
            data: bookings?._id,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        })
    }
});

router.delete('/', async (req: CustomRequest, res) => {
    try {
        const userId = req.userId;
        const parsedQuery = EventQuerySchema.safeParse(req.query);

        if(!userId || !parsedQuery.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: !parsedQuery.success ? "No Event provided to Delete Bookings under given User" : "Invalid Data Passed"
            });
            return;
        }

        const query: EventQueryType = parsedQuery.data;
        
        const uniqueBooking = await Booking.findOne({
            user: userId,
            event: query.eventId
        });

        if(!uniqueBooking) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Booking Does Not Exist"
            });
            return;
        }

        const bookings = await Booking.findOneAndDelete({
            user: userId,
            event: query.eventId
        });

        res.status(200).json({
            msg: "Booking Deleted",
            data: bookings?._id,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        })
    }
});

export default router;