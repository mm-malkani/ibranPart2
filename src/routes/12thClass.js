import { Router } from "express";
import {
  getBoard,
  getStreams,
  getSubjects,
  questionPaper,
} from "../controller/v1/12thClass.js";

const boardRouter = Router();

boardRouter.get("/boards", getBoard);
boardRouter.get("/boards/:boardSlug", getStreams);
boardRouter.get("/boards/:boardSlug/:streamSlug", getSubjects);
boardRouter.get("/boards/:boardSlug/:streamSlug/:subjectSlug", questionPaper);

export default boardRouter;
