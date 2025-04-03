import { Router } from "express";
import { createLead, sendOtp, verifyOtp } from "../controller/v1/formLead.js";

const leadRouter = Router();

leadRouter.post("/add", createLead);

leadRouter.post("/sendOtp", sendOtp);

leadRouter.post("/verifyOtp", verifyOtp);

export default leadRouter;
