import { z } from "zod";

const LeadSchema = z.object({
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  course: z.object({
    campus: z.string(),
    courseName: z.string(),
    specialization: z.string(),
    keyWord: z.string(),
  }),
  isVerified: z.boolean().default(false),
});

export { LeadSchema };

//Postman Example Request Body

// {
//   "name": "Ibran Raeen",
//   "email": "ibranr@letsupgrade.in",
//   "phone": "9920907303",
//   "courseKeyword": "GEINTBTECHCSE"
// }
