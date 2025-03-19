import dotenv from "dotenv";
import courseData from "../../config/courseData.js";
import { leadscoll } from "../../db/mongo.js";
import { LeadSchema } from "../../model/Lead.js";

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

export { leadHelper };
