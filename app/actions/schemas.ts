// schemas.ts
import { z } from "zod";

export const formSchema = z.object({
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
        /^[0-9()-\s]+$/.test(value) && value.replace(/\D/g, "").length === 10,
      {
        message:
          "Phone number must be 10 digits and match the format (XXX) XXX-XXXX.",
      }
    )
    .transform((value) => value.replace(/\D/g, "")),
  age: z
    .number()
    .min(13, { message: "You must be at least 13 years old." })
    .max(100, { message: "Please enter a valid age." }),
  genderIdentity: z
    .enum(["Male", "Female", "Non-binary", "Other", "Prefer not to Answer"])
    .optional(),
  race: z.string().optional(),
  hispanicOrLatino: z.enum(["Yes", "No", "Prefer not to answer"]).optional(),
  countryOfResidence: z.string().min(2, "Please enter a valid country."),
  tShirtSize: z.enum(["S", "M", "L", "XL", "XXL"]),
  dietaryRestrictions: z.string().optional(),
  specialAccommodations: z.string().optional(),
  isHighSchoolStudent: z.boolean(),
  currentSchool: z.string().optional(),
  levelOfStudy: z
    .enum(["High School", "Undergraduate", "Graduate", "Other"])
    .optional(),
  major: z.string().optional(),
  previousHackathons: z.number().optional(),
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
  shareWithMLH: z.boolean().optional(),
  receiveEmails: z.boolean().optional(),
});

// Infer the type for RegistrationData
export type RegistrationData = z.infer<typeof formSchema>;
