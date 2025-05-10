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

type UserSignupType = z.infer<typeof UserSignupSchema>;
type UserSigninType = z.infer<typeof UserSigninSchema>;

interface CustomRequest extends Request {
    userId?: string;
}

export { 
    UserSignupSchema, 
    UserSigninSchema, 
    UserSignupType, 
    UserSigninType, 
    CustomRequest
};