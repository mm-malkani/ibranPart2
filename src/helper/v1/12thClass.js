import { questionpapers } from "../../db/mongo.js";

const getBoardHelper = () => {
  return new Promise((resolve, reject) => {
    questionpapers()
      .then((questionpapers) => {
        return questionpapers.distinct("board");
      })
      .then((boards) => {
        const boardObject = boards.map((boardName) => ({
          name: boardName,
        }));
        resolve(boardObject);
      })
      .catch((err) => {
        reject(new Error(err.message || "board is not found"));
      });
  });
};

const getStreamsHelper = (BoardSlug) => {
  return new Promise((resolve, reject) => {
    questionpapers()
      .then((questionpapers) => {
        return questionpapers
          .findOne({
            board: { $regex: new RegExp(BoardSlug, "i") },
          })
          .then((paper) => {
            if (!paper) {
              throw new Error("Board Not Found");
            }
            return questionpapers.distinct("stream");
          });
      })
      .then((streams) => {
        const streamObject = streams
          .filter((stream) => stream)
          .map((streamName) => ({
            name: streamName,
          }));
        resolve(streamObject);
      })
      .catch((err) => {
        reject(new Error(err.message || "Stream not found"));
      });
  });
};

const getSubjectsHelper = (boardSlug, streamSlug) => {
  return new Promise((resolve, reject) => {
    questionpapers()
      .then((questionPapers) => {
        return questionPapers
          .findOne({
            board: { $regex: new RegExp(boardSlug, "i") },
            stream: { $regex: new RegExp(streamSlug, "i") },
          })
          .then((paper) => {
            if (!paper) {
              throw new Error("Board or stream not found");
            }
            return questionPapers.distinct("subject", {
              board: paper.board,
              stream: paper.stream,
            });
          });
      })
      .then((subjects) => {
        const subjectObjects = subjects
          .filter((subject) => subject)
          .map((subjectName) => ({
            name: subjectName,
            slug: subjectName.toLowerCase().replace(/\s+/g, "-"),
          }));
        resolve(subjectObjects);
      })
      .catch((err) => {
        reject(new Error(err.message || "Subject Not found"));
      });
  });
};

// const questionPaperHelper = (
//   boardSlug,
//   streamSlug = null,
//   subjectSlug = null
// ) => {
//   return new Promise((resolve, reject) => {
//     questionpapers()
//       .then((questionPapers) => {
//         const query = {
//           board: { $regex: new RegExp(boardSlug, "i") },
//         };
//         if (streamSlug) {
//           query.stream = { $regex: new RegExp(streamSlug, "i") };
//         }
//         if (subjectSlug) {
//           query.subject = { $regex: new RegExp(subjectSlug, "i") };
//         }
//         return questionPapers.find(query).toArray();
//       })
//       .then((papers) => {
//         if (papers.length === 0) {
//           throw new Error("paper not found");
//         }
//         resolve(papers);
//       })
//       .catch((err) => {
//         reject(new Error(err.message || "Error while fetching paper"));
//       });
//   });
// };

const questionPaperHelper = (
  boardSlug,
  streamSlug = null,
  subjectSlug = null
) => {
  return new Promise((resolve, reject) => {
    questionpapers()
      .then((questionPapers) => {
        const query = {};

        return questionPapers
          .findOne({ board: { $regex: new RegExp(boardSlug, "i") } })
          .then((boardPaper) => {
            if (!boardPaper) {
              throw new Error("Board not found");
            }
            query.board = boardPaper.board;

            if (!streamSlug) {
              return questionPapers.find(query).toArray();
            }

            return questionPapers
              .findOne({
                board: boardPaper.board,
                stream: { $regex: new RegExp(streamSlug, "i") },
              })
              .then((streamPaper) => {
                if (!streamPaper) {
                  throw new Error("Stream not found");
                }
                query.stream = streamPaper.stream;

                if (!subjectSlug) {
                  return questionPapers.find(query).toArray();
                }

                return questionPapers
                  .findOne({
                    board: boardPaper.board,
                    stream: streamPaper.stream,
                    subject: { $regex: new RegExp(subjectSlug, "i") },
                  })
                  .then((subjectPaper) => {
                    if (!subjectPaper) {
                      throw new Error("Subject not found");
                    }
                    query.subject = subjectPaper.subject;
                    return questionPapers.find(query).toArray();
                  });
              });
          });
      })
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(new Error(err.message || "Paper not found"));
      });
  });
};

export {
  getBoardHelper,
  getStreamsHelper,
  getSubjectsHelper,
  questionPaperHelper,
};
