import axios from "axios";
import dotenv from "dotenv";
import courseData from "../../config/courseData.js";
import { leadscoll } from "../../db/mongo.js";
import { LeadSchema } from "../../model/Lead.js";
import { OtpSchema } from "../../model/sendOtp.js";

dotenv.config();

const leadHelper = (leadData) => {
  return leadscoll()
    .then((leadsCollection) => {
      const courseInfo = courseData.find(
        (course) => course.keyWord === leadData.courseKeyword
      );

      if (!courseInfo) {
        throw new Error("Please Provide a valid course keyword!");
      }

      const validatedData = LeadSchema.parse({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        course: {
          campus: courseInfo.campus,
          courseName: courseInfo.course,
          specialization: courseInfo.specialization,
          keyWord: courseInfo.keyWord,
        },
      });

      return leadsCollection
        .findOne({
          $or: [{ email: leadData.email }, { phone: leadData.phone }],
        })
        .then((existingLead) => {
          if (existingLead && existingLead.isVerified) {
            throw new Error("Lead already exists and is verified");
          }

          if (existingLead && !existingLead.isVerified) {
            const updateData = {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              course: validatedData.course,
              updatedAt: validatedData.updatedAt,
            };

            return leadsCollection
              .updateOne({ _id: existingLead._id }, { $set: updateData })
              .then(() => ({
                ...updateData,
                _id: existingLead._id,
                isVerified: existingLead.isVerified,
              }));
          }

          return leadsCollection
            .insertOne(validatedData)
            .then((result) => ({ ...validatedData, _id: result.insertedId }));
        });
    })
    .catch((error) => {
      console.error("Error in leadHelper:", error);
      throw error;
    });
};

const sendOtpHelper = (phone) => {
  let validatedPhone, formattedPhone, leadsDB, otp;

  return Promise.resolve()
    .then(() => {
      validatedPhone = OtpSchema.parse({ phone }).phone;
      formattedPhone = `+91${validatedPhone.trim()}`;
      return leadscoll();
    })
    .then((collection) => {
      leadsDB = collection;
      return leadsDB.findOne({ phone: validatedPhone });
    })
    .then((lead) => {
      if (!lead) throw new Error("No lead found with this phone number");

      otp = Math.floor(100000 + Math.random() * 900000).toString();
      return leadsDB.updateOne(
        { phone: validatedPhone },
        {
          $set: {
            otp,
            otpExpiry: new Date(Date.now() + 15 * 60 * 1000),
            updatedAt: new Date(),
          },
        }
      );
    })
    .then(() => {
      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE;

      if (!authKey || !templateId)
        throw new Error("MSG91 configuration missing");

      console.log(`📩 Sending OTP ${otp} to ${formattedPhone}`);

      return axios.post(
        `https://control.msg91.com/api/v5/otp?otp_expiry=15&template_id=${templateId}&mobile=${formattedPhone}&authkey=${authKey}&realTimeResponse=true`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
    })
    .then((response) => {
      console.log("MSG91 Response:", response.data);

      if (response.data?.type === "success") {
        return { phone: validatedPhone, message: "OTP sent successfully" };
      }

      console.error("MSG91 Error:", response.data);
      throw new Error(`Failed to send OTP: ${JSON.stringify(response.data)}`);
    })
    .catch((error) => {
      console.error("Error in sendOtpHelper:", error);
      throw error;
    });
};

const verifyOtpHelper = (phone, otp) => {
  let validatedPhone, leadsDB, leadData;

  return Promise.resolve()
    .then(() => {
      validatedPhone = OtpSchema.parse({ phone }).phone;
      return leadscoll();
    })
    .then((collection) => {
      leadsDB = collection;
      return leadsDB.findOne({ phone: validatedPhone });
    })
    .then((lead) => {
      if (!lead) throw new Error("No lead found with this phone number");
      if (!lead.otp) throw new Error("No OTP was sent for this phone number");
      if (lead.otpExpiry && new Date() > new Date(lead.otpExpiry))
        throw new Error("OTP has expired");
      if (lead.otp !== otp) throw new Error("Invalid OTP");

      leadData = lead;
      return leadsDB.updateOne(
        { phone: validatedPhone },
        {
          $set: { isVerified: true, updatedAt: new Date() },
          $unset: { otp: "", otpExpiry: "" },
        }
      );
    })
    .then(() => ({
      phone: validatedPhone,
      isVerified: true,
      name: leadData.name,
      email: leadData.email,
      course: leadData.course,
    }))
    .catch((error) => {
      console.error("Error in verifyOtpHelper:", error);
      throw error;
    });
};

export { leadHelper, sendOtpHelper, verifyOtpHelper };
