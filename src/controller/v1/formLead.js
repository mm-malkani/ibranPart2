import { error, success } from "../../config/response.js";
import { leadHelper } from "../../helper/v1/leadHelper.js";

const createLead = (req, res) => {
  const leadData = req.body;

  leadHelper(leadData)
    .then((result) => {
      res
        .status(200)
        .json(
          success("Lead created successfully", { data: result }, res.statusCode)
        );
    })
    .catch((err) => {
      res
        .status(400)
        .json(
          error("Error creating lead", { error: err.message }, res.statusCode)
        );
    });
};

export { createLead };
