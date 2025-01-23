// RegistrationForm.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Custom components
import { FormInputField } from "../FormInputField";
import { FormSelectField } from "../FormSelectField";
import { FormCheckboxField } from "../FormCheckboxField";
import { ComboboxSelect } from "@/components/customui/ComboSelect";

// Schema and types
import { RegistrationData, formSchema } from "@/app/actions/schemas";

import { registerUser } from "@/app/actions/register";

// Predefined options
const predefinedSchools = [
  { label: "University of Kansas", value: "University of Kansas" },
  { label: "Kansas State University", value: "Kansas State University" },
  {
    label: "University of Missouri-Kansas City",
    value: "University of Missouri-Kansas City",
  },
  {
    label: "Haskell Indian Nations University",
    value: "Haskell Indian Nations University",
  },
  { label: "Wichita State University", value: "Wichita State University" },
  {
    label: "Johnson County Community College",
    value: "Johnson County Community College",
  },
];

export function RegistrationForm() {
  const [showChaperoneFields, setShowChaperoneFields] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Function to check if a field is required based on the Zod schema
  const isFieldRequired = useCallback(
    (fieldName: keyof RegistrationData) => {
      const values = form.getValues();
      const fieldSchema = formSchema._def.schema.shape[fieldName];

      // Chaperone fields are required only if levelOfStudy is "High School"
      if (
        [
          "chaperoneFirstName",
          "chaperoneLastName",
          "chaperoneEmail",
          "chaperonePhoneNumber",
        ].includes(fieldName)
      ) {
        return values.levelOfStudy === "High School";
      }

      return !(
        fieldSchema instanceof z.ZodOptional ||
        fieldSchema instanceof z.ZodDefault ||
        fieldSchema.safeParse(undefined).success
      );
    },
    [form]
  );

  // Define form fields with configurations
  const personalInfoFields = [
    {
      name: "firstName" as const,
      label: "First Name",
      placeholder: "First name",
      required: isFieldRequired("firstName"),
    },
    {
      name: "lastName" as const,
      label: "Last Name",
      placeholder: "Last name",
      required: isFieldRequired("lastName"),
    },
    {
      name: "phoneNumber" as const,
      label: "Phone Number",
      placeholder: "Phone number",
      required: isFieldRequired("phoneNumber"),
    },
    {
      name: "age" as const,
      label: "Age",
      placeholder: "Age",
      required: isFieldRequired("age"),
      type: "number",
    },
  ];

  // Define types for select fields
  type GenderIdentity = NonNullable<RegistrationData["genderIdentity"]>;
  type Race = NonNullable<RegistrationData["race"]>;
  type HispanicOrLatino = NonNullable<RegistrationData["hispanicOrLatino"]>;
  type TShirtSize = NonNullable<RegistrationData["tShirtSize"]>;
  type LevelOfStudy = NonNullable<RegistrationData["levelOfStudy"]>;

  // Define options with correct typing
  const genderIdentityOptions: { label: string; value: GenderIdentity }[] = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Non-binary", value: "Non-binary" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to Answer", value: "Prefer not to Answer" },
  ];

  const raceOptions: { label: string; value: Race }[] = [
    { label: "White", value: "White" },
    { label: "Black or African American", value: "Black or African American" },
    { label: "Asian", value: "Asian" },
    {
      label: "Native Hawaiian or Other Pacific Islander",
      value: "Native Hawaiian or Other Pacific Islander",
    },
    {
      label: "American Indian or Alaska Native",
      value: "American Indian or Alaska Native",
    },
    { label: "Other", value: "Other" },
    { label: "Prefer not to answer", value: "Prefer not to answer" },
  ];

  const hispanicOrLatinoOptions: {
    label: string;
    value: HispanicOrLatino;
  }[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Prefer not to answer", value: "Prefer not to answer" },
  ];

  const tShirtSizeOptions: { label: string; value: TShirtSize }[] = [
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
    { label: "XXXL", value: "XXXL" },
  ];

  const levelOfStudyOptions: { label: string; value: LevelOfStudy }[] = [
    { label: "Undergraduate", value: "Undergraduate" },
    { label: "High School", value: "High School" },
    { label: "Graduate", value: "Graduate" },
    { label: "Other", value: "Other" },
  ];

  const onSubmit = async (data: RegistrationData) => {
    try {
      // Replace with your registration function
      await registerUser(data);
      toast.success("Registration successful!");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error("Registration failed, please try again.");
    }
  };

  // Handle form validation errors
  const onError = (errors: typeof form.formState.errors) => {
    console.error("Validation errors:", errors);
    toast.error("Please correct the errors and try again.");
  };

  // Calculate progress and check form validity
  useEffect(() => {
    const calculateProgress = () => {
      const values = form.getValues();

      const requiredFields = Object.keys(
        formSchema._def.schema.shape
      ) as (keyof RegistrationData)[];

      const dynamicRequiredFields = requiredFields.filter((key) =>
        isFieldRequired(key)
      );

      const filledFields = dynamicRequiredFields.reduce((count, key) => {
        const value = values[key];
        // Special handling for boolean fields
        if (typeof value === "boolean") {
          return value ? count + 1 : count;
        } else {
          return value !== undefined && value !== "" ? count + 1 : count;
        }
      }, 0);

      const totalRequiredFields = dynamicRequiredFields.length;

      let calculatedProgress = Math.round(
        (filledFields / totalRequiredFields) * 100
      );

      // Ensure the progress is set to 100% when the form is valid
      if (form.formState.isValid) {
        calculatedProgress = 100;
      } else {
        calculatedProgress = Math.min(calculatedProgress, 100);
      }

      setProgress(calculatedProgress);
    };

    calculateProgress(); // Initial calculation on mount
    const subscription = form.watch(() => {
      calculateProgress();
    });

    return () => subscription.unsubscribe();
  }, [form, isFieldRequired]);

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-center text-xl py-4">
            HackKU25 Registration
          </CardTitle>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            {/* Personal Information Section */}
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="flex space-x-4">
              {personalInfoFields.slice(0, 2).map((field) => (
                <FormInputField key={field.name} {...field} />
              ))}
            </div>
            <div className="flex space-x-4">
              <FormInputField {...personalInfoFields[2]} />
              <FormInputField {...personalInfoFields[3]} />
            </div>
            {/* Select Fields */}
            <div className="flex space-x-4">
              <FormSelectField<GenderIdentity>
                name="genderIdentity"
                label="Gender Identity"
                options={genderIdentityOptions}
                required={isFieldRequired("genderIdentity")}
              />
              <FormSelectField<Race>
                name="race"
                label="Race"
                options={raceOptions}
                required={isFieldRequired("race")}
              />
            </div>
            <FormSelectField<HispanicOrLatino>
              name="hispanicOrLatino"
              label="Are you Hispanic or Latino?"
              options={hispanicOrLatinoOptions}
              required={isFieldRequired("hispanicOrLatino")}
            />

            {/* Education Information Section */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Education Information</h2>
            <ComboboxSelect
              name="currentSchool"
              label="Current School"
              required={isFieldRequired("currentSchool")}
              placeholder="Select your school"
              options={predefinedSchools}
              allowCustomInput
              closeOnSelect
            />
            <div className="flex space-x-4">
              <FormSelectField<LevelOfStudy>
                name="levelOfStudy"
                label="Level of Study"
                options={levelOfStudyOptions}
                required={isFieldRequired("levelOfStudy")}
                onChange={(value) => {
                  form.setValue("levelOfStudy", value);
                  setShowChaperoneFields(value === "High School");
                }}
              />
              {!showChaperoneFields && (
                <ComboboxSelect
                  name="major"
                  label="Major"
                  required={isFieldRequired("major")}
                  placeholder="Select your major"
                  options={[
                    { label: "Computer Science", value: "Computer Science" },
                    {
                      label: "Electrical Engineering",
                      value: "Electrical Engineering",
                    },
                    {
                      label: "Mechanical Engineering",
                      value: "Mechanical Engineering",
                    },
                    {
                      label: "Business Administration",
                      value: "Business Administration",
                    },
                    { label: "Psychology", value: "Psychology" },
                    { label: "Biology", value: "Biology" },
                  ]}
                  allowCustomInput
                  closeOnSelect
                />
              )}
            </div>

            {/* Chaperone Information */}
            {showChaperoneFields && (
              <>
                <hr className="my-4" />
                <h2 className="text-lg font-semibold">Chaperone Information</h2>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                  <p className="font-bold">Note:</p>
                  <p>
                    A Chaperone is <u>required</u> for all high school students.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <FormInputField
                    name="chaperoneFirstName"
                    label="Chaperone First Name"
                    placeholder="Chaperone's first name"
                    required={isFieldRequired("chaperoneFirstName")}
                  />
                  <FormInputField
                    name="chaperoneLastName"
                    label="Chaperone Last Name"
                    placeholder="Chaperone's last name"
                    required={isFieldRequired("chaperoneLastName")}
                  />
                </div>
                <div className="flex space-x-4">
                  <FormInputField
                    name="chaperoneEmail"
                    label="Chaperone Email"
                    placeholder="Chaperone's email"
                    required={isFieldRequired("chaperoneEmail")}
                  />
                  <FormInputField
                    name="chaperonePhoneNumber"
                    label="Chaperone Phone #"
                    placeholder="Chaperone's phone number"
                    required={isFieldRequired("chaperonePhoneNumber")}
                  />
                </div>
              </>
            )}

            {/* Additional Information Section */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Additional Information</h2>
            <ComboboxSelect
              name="countryOfResidence"
              label="Country of Residence"
              required={isFieldRequired("countryOfResidence")}
              placeholder="Select your country"
              options={[
                { label: "United States", value: "United States" },
                { label: "Canada", value: "Canada" },
                // Add more countries as needed
              ]}
              allowCustomInput
              closeOnSelect
            />
            <div className="flex space-x-4">
              <FormSelectField<TShirtSize>
                name="tShirtSize"
                label="T-Shirt Size"
                options={tShirtSizeOptions}
                required={isFieldRequired("tShirtSize")}
              />

              <FormInputField
                name="previousHackathons"
                label="Hackathons Attended"
                placeholder="Enter the number of previous hackathons"
                type="number"
                required={isFieldRequired("previousHackathons")}
              />
            </div>
            <div className="flex space-x-4">
              <FormInputField
                name="dietaryRestrictions"
                label="Dietary Restrictions"
                placeholder="Enter any dietary restrictions"
                required={isFieldRequired("dietaryRestrictions")}
              />
              <FormInputField
                name="specialAccommodations"
                label="Special Accoms."
                placeholder="Special accommodations"
                required={isFieldRequired("specialAccommodations")}
              />
            </div>

            {/* Agreements Section */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Agreements</h2>
            <div className="space-y-3">
              <FormCheckboxField
                name="agreeHackKUCode"
                label={
                  <>
                    I agree to the{" "}
                    <Link href="/rules" className="underline" target="_blank">
                      HackKU Code of Conduct
                    </Link>
                    .
                  </>
                }
                required={isFieldRequired("agreeHackKUCode")}
              />
              <FormCheckboxField
                name="agreeMLHCode"
                label={
                  <>
                    I agree to the{" "}
                    <Link
                      href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                      className="underline"
                      target="_blank"
                    >
                      MLH Code of Conduct
                    </Link>
                    .
                  </>
                }
                required={isFieldRequired("agreeMLHCode")}
              />
              <FormCheckboxField
                name="shareWithMLH"
                label={
                  <>
                    I authorize sharing my registration information with Major
                    League Hacking for event administration, ranking, and MLH
                    administration in-line with the{" "}
                    <Link
                      href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                      target="_blank"
                      className="underline"
                    >
                      MLH Privacy Policy
                    </Link>
                    . I further agree to the terms of both the{" "}
                    <Link
                      href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                      target="_blank"
                      className="underline"
                    >
                      MLH Contest Terms
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                      target="_blank"
                      className="underline"
                    >
                      MLH Privacy Policy
                    </Link>
                    .
                  </>
                }
                required={isFieldRequired("shareWithMLH")}
              />
              <FormCheckboxField
                name="receiveEmails"
                label="I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements."
                required={isFieldRequired("receiveEmails")}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center mb-2 whitespace-nowrap">
              <Progress value={progress} className="w-full h-2" />
              <span className="text-sm font-medium ml-2">{progress}%</span>
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Register!
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
