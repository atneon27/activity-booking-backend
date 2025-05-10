import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Router } from 'express';
import { User } from '../models/userSchema.js';
import { UserSignupSchema, UserSignupType, UserSigninSchema, UserSigninType } from '../types/types.js';

const router = Router();

router.post('/signup', express.json(), async (req, res) => {
    try {
        const recivedBody = req.body;
        const paresedBody = UserSignupSchema.safeParse(recivedBody);
        
        if(!paresedBody.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: paresedBody.error.issues
            });
            return;
        }

        const body: UserSignupType = paresedBody.data;

        const userWithEmail = await User.findOne({
            email: body.email
        });

        const userWithPhoneNo = await User.findOne({
            phoneNo: body.phoneNo
        });

        if(userWithEmail || userWithPhoneNo) {
            res.status(403).json({
                msg: null,
                data: null,
                error: "User Already Exists"
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await User.create({
            name: body.name,
            email: body.email,
            countryCode: body.countryCode,
            phoneNo: body.phoneNo,
            password: hashedPassword
        }); 

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            msg: "User Created",
            data: {
                email: user.email,
                token: token
            },
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

router.post('/signin', express.json(), async (req, res) => {
    try {
        const recivedBody = req.body;
        const paresedBody = UserSigninSchema.safeParse(recivedBody);
        
        if(!paresedBody.success) {
            res.status(400).json({
                msg: null,
                data: null,
                error: "Invalid Data Recived"
            });
            return;
        }

        const body: UserSigninType = paresedBody.data;

        const user = await User.findOne({
            email: body.email
        });

        if(!user) {
            res.status(404).json({
                msg: null,
                data: null,
                error: "User Dose Not Exists"
            });
            return;
        }

        const comparePassword = await bcrypt.compare(body.password, user.password);

        if(!comparePassword) {
            res.status(403).json({
                msg: null,
                data: null,
                error: "Invalid Password"
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            msg: "User Signed In",
            data: {
                email: user.email,
                token: token
            },
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