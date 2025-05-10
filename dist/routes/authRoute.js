import { Router } from "express";
const router = Router();
router.get("/login", (req, res) => {
    res.status(200).json({
        msg: process.env.TAKE
    });
});
export default router;
