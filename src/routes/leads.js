import { Router } from "express";
import { createLead } from "../controller/v1/formLead.js";

const leadRouter = Router();

leadRouter.post("/add", createLead);

export default leadRouter;
