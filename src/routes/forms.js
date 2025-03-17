import { Router } from "express";
import { Lead } from "../controller/v1/forms.js";

const formRouter = Router();

formRouter.get("/lead", Lead);

export default formRouter;
