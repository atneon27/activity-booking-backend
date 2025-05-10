import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/types.js";

export default function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        
        if(!authHeader || !token) {
            res.status(401).json({
                msg: null,
                data: null,
                error: "Unauthorized"
            });
            return;
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string }

        if(!decodedToken || !decodedToken.userId) {
            res.status(401).json({
                msg: null,
                data: null,
                error: "Unauthorized"
            });
            return;
        }

        req.userId = decodedToken.userId;
        
        next();
    } catch(err) {
        res.status(500).json({
            msg: null,
            data: null,
            error: "Internal Server Error"
        });
    }
}