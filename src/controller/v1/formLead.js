import { error, success } from "../../config/response.js";
import {
  leadHelper,
  sendOtpHelper,
  verifyOtpHelper,
} from "../../helper/v1/leadHelper.js";

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

const sendOtp = (req, res) => {
  const { phone } = req.body;

  sendOtpHelper(phone)
    .then((result) => {
      res
        .status(200)
        .json(
          success("OTP sent successfully", { data: result }, res.statusCode)
        );
    })
    .catch((err) => {
      res
        .status(400)
        .json(
          error("Error sending OTP", { error: err.message }, res.statusCode)
        );
    });
};

const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  verifyOtpHelper(phone, otp)
    .then((result) => {
      res
        .status(200)
        .json(
          success("OTP verified successfully", { data: result }, res.statusCode)
        );
    })
    .catch((err) => {
      res
        .status(400)
        .json(
          error("Error verifying OTP", { error: err.message }, res.statusCode)
        );
    });
};

export { createLead, sendOtp, verifyOtp };
