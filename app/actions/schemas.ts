// schemas.ts
import { z } from "zod";

export const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    phoneNumber: z
      .string()
      .refine(
        (value) =>
          /^[0-9()-\s]+$/.test(value) &&
          (value.replace(/\D/g, "").length === 10 ||
            value.replace(/\D/g, "").length === 11),
        {
          message: "Phone number must be 10 or 11 digits",
        }
      )
      .transform((value) => value.replace(/\D/g, "")),
    age: z.coerce
      .number()
      .int()
      .min(14, "You must be at least 14 years old.")
      .max(100, "You must be at most 100 years old."),
    resumeUrl: z.string().optional(),

    genderIdentity: z
      .enum(["Male", "Female", "Non-binary", "Other", "Prefer not to Answer"])
      .optional(),
    race: z.string(),
    hispanicOrLatino: z.enum(["Yes", "No", "Prefer not to answer"]),
    countryOfResidence: z.string().min(2, "Please enter a valid country."),
    tShirtSize: z.enum(["S", "M", "L", "XL", "XXL", "XXXL"]),
    dietaryRestrictions: z.string().optional(),
    specialAccommodations: z.string().optional(),
    currentSchool: z.string(),
    levelOfStudy: z.enum(["High School", "Undergraduate", "Graduate", "Other"]),
    major: z.string().optional(),
    minor: z.string().optional(),
    previousHackathons: z.coerce.number(),
    chaperoneFirstName: z.string().optional(),
    chaperoneLastName: z.string().optional(),
    chaperoneEmail: z.string().optional(),
    chaperonePhoneNumber: z.string().optional(),
    agreeHackKUCode: z.boolean().refine((value) => value === true, {
      message: "You must agree to the HackKU Code of Conduct.",
    }),
    agreeMLHCode: z.boolean().refine((value) => value === true, {
      message: "You must agree to the MLH Code of Conduct.",
    }),
    shareWithMLH: z.boolean().refine((value) => value === true, {
      message: "You must agree to share your data with MLH.",
    }),
    receiveEmails: z.boolean().optional(),
    photoWaiver: z.boolean().refine((value) => value === true, {
      message: "You must agree to the waiver.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.levelOfStudy === "High School") {
      if (!data.chaperoneFirstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chaperoneFirstName"],
          message: "Chaperone first name is required for high school students.",
        });
      }
      if (!data.chaperoneLastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chaperoneLastName"],
          message: "Chaperone last name is required for high school students.",
        });
      }
      if (!data.chaperoneEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chaperoneEmail"],
          message: "Chaperone email is required for high school students.",
        });
      }
      if (!data.chaperonePhoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chaperonePhoneNumber"],
          message:
            "Chaperone phone number is required for high school students.",
        });
      }
    }
  });

export type RegistrationData = z.infer<typeof formSchema>;
