import { formscoll } from "../../db/mongo.js";
import formSchema from "../../model/formSchema.js";

const leadHelper = () => {
  formscoll();
  formSchema();
};

export { leadHelper };
