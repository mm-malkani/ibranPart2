const formSchema = {
  name: { type: "string", required: true },
  email: { type: "string", required: true },
  message: { type: "string", required: true },
  createdAt: { type: "date", default: new Date() },
};

export default formSchema;
