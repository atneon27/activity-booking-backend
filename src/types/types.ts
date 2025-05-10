import { z } from "zod";
import { Request } from "express";

const UserSignupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    countryCode: z.string().max(3).regex(/(\+\d{1,3})/, "Invalid Country Code"),
    phoneNo: z.string().min(10, "Invalid Phone Number Length, Should be 10 digits"),
    password: z.string()
});

const UserSigninSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const EventSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    eventTime: z.string().transform((val) => new Date(val))
});

const EventQuerySchema = z.object({
    eventId: z.string(),
});

type UserSignupType = z.infer<typeof UserSignupSchema>;
type UserSigninType = z.infer<typeof UserSigninSchema>;
type EventType = z.infer<typeof EventSchema>;
type EventQueryType = z.infer<typeof EventQuerySchema>;

interface CustomRequest extends Request {
    userId?: string;
}

export { 
    UserSignupSchema, 
    UserSigninSchema, 
    EventSchema,
    EventQuerySchema,
    UserSignupType, 
    UserSigninType, 
    CustomRequest,
    EventType,
    EventQueryType
};