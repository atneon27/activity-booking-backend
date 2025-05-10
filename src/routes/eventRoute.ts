import express, { Router } from "express"; 
import { Event } from "../models/eventSchema.js";
import { EventSchema, EventQuerySchema, EventType, EventQueryType } from "../types/types.js";
import authMiddleware from "../middleware/middleware.js";

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
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
            console.log(query.eventId)

            const event = await Event.findOne({
                _id: query.eventId
            });

            res.status(200).json({
                msg: "Event Retrieved",
                data: {
                    eventId: event?._id,
                    title: event?.title,
                    description: event?.description,
                    location: event?.location,
                    eventTime: event?.eventTime,
                    createdOn: event?.createdOn
                },
                error: null
            });
            return;
        }

        const events = await Event.find({});

        const formatedEvents = events.map((event) => {
            return {
                eventId: event._id,
                title: event.title,
                description: event.description,
                location: event.location,
                eventTime: event.eventTime,
                createdOn: event.createdOn
            }
        });

        res.status(200).json({
            msg: "Events Retrieved",
            data: formatedEvents,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        });
    }
});

router.put('/', express.json(), async (req, res) => {
    try {
        const parsedQuery = EventQuerySchema.safeParse(req.query);
        const parsedBody = EventSchema.safeParse(req.body);

        if(!parsedBody.success || !parsedQuery.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: !parsedBody.success ? parsedBody.error?.issues : parsedQuery.error?.issues
            });
            return;
        }

        const query: EventQueryType = parsedQuery.data;
        const body: EventType = parsedBody.data;

        const uniqueEvent = await Event.findOne({
            title: body.title,
            description: body.description,
            location: body.location,
            eventTime: body.eventTime
        });

        if(!uniqueEvent) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Event Does Not Exist"
            });
            return;
        }

        const event = await Event.findOneAndUpdate({
            id: query.eventId
        }, {
            title: body.title,
            description: body.description,
            location: body.location,
            eventTime: body.eventTime
        });

        res.status(200).json({
            msg: "Event Updated",
            data: query.eventId,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        });
    }
});

router.post('/', express.json(), async (req, res) => {
    try {
        const parsedBody = EventSchema.safeParse(req.body);

        if(!parsedBody.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: parsedBody.error.issues  
            });
            return;
        }

        const body: EventType = parsedBody.data;

        const uniqueEvent = await Event.findOne({
            title: body.title,
            description: body.description,
            location: body.location,
            eventTime: body.eventTime
        });
        
        if(body.eventTime < new Date() || !uniqueEvent) {
            res.status(400).json({
                msg: null,
                data: null,
                error: !uniqueEvent ? "Event Already Exists" : "Event Time cannot be in the past"
            });
            return;
        }

        const event = await Event.create({
            title: body.title,
            description: body.description,
            location: body.location,
            eventTime: body.eventTime
        });
        
        res.status(201).json({
            msg: "Event Created",
            data: { eventId: event._id, ...body },
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        });
    }
});

router.delete('/', async (req, res) => {
    try {
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

        const uniqueEvent = await Event.findOne({
            id: query.eventId
        });

        if(!uniqueEvent) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Event Does Not Exist"
            });
            return;
        }

        const event = await Event.findOneAndDelete({
            id: query.eventId
        });

        res.status(200).json({
            msg: "Event Deleted",
            data: query.eventId,
            error: null
        });
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        });
    }
});

export default router;