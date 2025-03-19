import { z } from "zod";

const OtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export { OtpSchema };

// {
//   "phone": "9920907303",
//   "otp": "123456",
// }
