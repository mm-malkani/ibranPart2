import { error, success } from "../../config/response.js";
import {
  getBoardHelper,
  getStreamsHelper,
  getSubjectsHelper,
  questionPaperHelper,
} from "../../helper/v1/12thClass.js";

const getBoard = (req, res) => {
  getBoardHelper()
    .then((results) => {
      res.status(200).json(
        success(
          "Board fetched successfully",
          {
            data: results,
          },
          res.statusCode
        )
      );
    })
    .catch((err) => {
      res.status(400).json(
        error(
          "error fetching board",
          {
            error: err.message,
          },
          res.statusCode
        )
      );
    });
};

const getStreams = (req, res) => {
  const { boardSlug } = req.params;

  getStreamsHelper(boardSlug)
    .then((results) => {
      res
        .status(200)
        .json(
          success(
            "Stream fetched Successfully",
            { data: results },
            res.statusCode
          )
        );
    })
    .catch((err) => {
      res.status(400).json(
        error(
          "Stream not found",
          {
            error: err.message,
          },
          res.statusCode
        )
      );
    });
};

const getSubjects = (req, res) => {
  const { boardSlug, streamSlug } = req.params;

  getSubjectsHelper(boardSlug, streamSlug)
    .then((results) => {
      res
        .status(200)
        .json(
          success(
            "Subjects fetched Successfully",
            { data: results },
            res.statusCode
          )
        );
    })
    .catch((err) => {
      res.status(400).json(
        error(
          "Subject not found",
          {
            error: err.message,
          },
          res.statusCode
        )
      );
    });
};

const questionPaper = (req, res) => {
  const { boardSlug, streamSlug, subjectSlug } = req.params;

  questionPaperHelper(boardSlug, streamSlug, subjectSlug)
    .then((result) => {
      res.status(200).json(
        success(
          "Question papers fetched successfully",
          {
            data: result,
          },
          res.statusCode
        )
      );
    })
    .catch((err) => {
      res.status(400).json(
        error(
          "question papers not found",
          {
            error: err.message,
          },
          res.statusCode
        )
      );
    });
};

export { getBoard, getStreams, getSubjects, questionPaper };
