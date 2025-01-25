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
import { FormInputField } from "../customui/FormInputField";
import { FormSelectField } from "../customui/FormSelectField";
import { FormCheckboxField } from "../customui/FormCheckboxField";
import { ComboboxSelect } from "@/components/customui/ComboSelect";

// Schema and types
import { RegistrationData, formSchema } from "@/app/actions/schemas";

import { registerUser } from "@/app/actions/register";
import constants from "@/constants";

// Predefined options
const predefinedSchools = [
  { label: "University of Kansas", value: "University of Kansas" },
  {
    label: "University of Nebraska at Kearney",
    value: "University of Nebraska at Kearney",
  },
  { label: "Kansas State University", value: "Kansas State University" },
  { label: "Arizona State University", value: "Arizona State University" },
  {
    label: "Florida International University",
    value: "Florida International University",
  },
  { label: "Colorado School of Mines", value: "Colorado School of Mines" },
  { label: "Grinnell College", value: "Grinnell College" },
  {
    label: "Johnson County Community College",
    value: "Johnson County Community College",
  },
  { label: "San Jose State University", value: "San Jose State University" },
  {
    label: "University of Missouri St. Louis",
    value: "University of Missouri St. Louis",
  },
  {
    label: "University of Missouri-Kansas City",
    value: "University of Missouri-Kansas City",
  },
  {
    label: "University of Nebraska Kearney",
    value: "University of Nebraska Kearney",
  },
  { label: "Blue Valley CAPS", value: "Blue Valley CAPS" },
  {
    label: "Haskell Indian Nations University",
    value: "Haskell Indian Nations University",
  },
  {
    label: "Northwest Missouri State University",
    value: "Northwest Missouri State University",
  },
  { label: "Saint Louis University", value: "Saint Louis University" },
  {
    label: "University of Central Florida",
    value: "University of Central Florida",
  },
  {
    label: "University of Central Missouri",
    value: "University of Central Missouri",
  },
  { label: "University of Minnesota", value: "University of Minnesota" },
  { label: "University of Rochester", value: "University of Rochester" },
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
    { label: "Black or African American", value: "Black or African American" },
    { label: "White", value: "White" },
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
  ];

  const levelOfStudyOptions: { label: string; value: LevelOfStudy }[] = [
    { label: "Undergraduate", value: "Undergraduate" },
    { label: "Graduate", value: "Graduate" },
    { label: "High School", value: "High School" },
    { label: "Other", value: "Other" },
  ];

  const onSubmit = async (data: RegistrationData) => {
    try {
      // Replace with your registration function
      await registerUser(data);
      router.push("/profile");
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error(
        "Registration failed, please try again. Please contact support if the issue persists."
      );
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
    <Card className="max-w-3xl mx-auto mt-2 border-none shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-center text-xl py-4">
            HackKU25 Registration
          </CardTitle>

          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="w-full h-2 my-6" />

        <p className="pt-4 text-sm">
          HackKU25 will be held at the University of Kansas School of
          Engineering from April 4th - 6th, in-person. For more information,
          reach out to{" "}
          <Link href={`mailto:${constants.supportEmail}`} className="underline">
            {constants.supportEmail}
          </Link>{" "}
          or join our{" "}
          <Link href={constants.discordInvite} className="underline">
            Discord
          </Link>{" "}
          server for questions.
        </p>
        <p className="pt-2 text-sm">
          <b>ALL</b> high schoolers under the age of 18 must have an adult
          chaperone in attendance with them. Chaperones may accompany a single
          student or a group of students.
        </p>
        <p className="pt-2 text-sm">
          You must be a student to attend, if you are a working professional and
          would like to volunteer during the event, please contact us via{" "}
          <Link href={`mailto:${constants.supportEmail}`} className="underline">
            {constants.supportEmail}
          </Link>{" "}
          .
        </p>
        <p className="py-2 text-sm">
          We are excited to create with you in April! ❤️😁
        </p>
        <hr />
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
              <ComboboxSelect
                name="countryOfResidence"
                label="Country of Residence"
                required={isFieldRequired("countryOfResidence")}
                placeholder="Country"
                options={[
                  { label: "United States", value: "United States" },
                  { label: "Canada", value: "Canada" },
                  { label: "Mexico", value: "Mexico" },
                  { label: "Brazil", value: "Brazil" },
                  { label: "United Kingdom", value: "United Kingdom" },
                  { label: "Germany", value: "Germany" },
                  { label: "France", value: "France" },
                  { label: "Spain", value: "Spain" },
                  { label: "Italy", value: "Italy" },
                  { label: "China", value: "China" },
                  { label: "Japan", value: "Japan" },
                  { label: "Australia", value: "Australia" },
                  { label: "India", value: "India" },
                  { label: "Singapore", value: "Singapore" },
                  { label: "India", value: "India" },
                  { label: "Singapore", value: "Singapore" },
                ]}
                allowCustomInput
                closeOnSelect
              />
              <FormSelectField<GenderIdentity>
                name="genderIdentity"
                label="Gender Identity"
                options={genderIdentityOptions}
                required={isFieldRequired("genderIdentity")}
              />
            </div>
            <div className="flex space-x-4">
              <ComboboxSelect
                name="race"
                label="Race"
                required={isFieldRequired("race")}
                placeholder="Race"
                options={raceOptions}
                closeOnSelect
                multiselect
              />

              <FormSelectField<HispanicOrLatino>
                name="hispanicOrLatino"
                label="Hispanic or Latino?"
                options={hispanicOrLatinoOptions}
                required={isFieldRequired("hispanicOrLatino")}
              />
            </div>

            {/* Education Information Section */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Education Information</h2>
            <div className="flex space-x-4">
              <ComboboxSelect
                name="currentSchool"
                label="Current School"
                required={isFieldRequired("currentSchool")}
                placeholder="Enter School"
                options={predefinedSchools}
                allowCustomInput
                closeOnSelect
              />
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
            </div>
            <div className="flex space-x-4">
              {!showChaperoneFields && (
                <>
                  <ComboboxSelect
                    name="major"
                    label="Major(s)"
                    required={isFieldRequired("major")}
                    placeholder="Select your major(s)"
                    options={[
                      { label: "Computer Science", value: "Computer Science" },
                      {
                        label: "Computer Engineering",
                        value: "Computer Engineering",
                      },
                      {
                        label: "Electrical Engineering",
                        value: "Electrical Engineering",
                      },
                      {
                        label: "Aerospace Engineering",
                        value: "Aerospace Engineering",
                      },
                      {
                        label: "Chemical Engineering",
                        value: "Chemical Engineering",
                      },
                      {
                        label: "Interdisciplinary Engineering",
                        value: "Interdisciplinary Engineering",
                      },
                      {
                        label: "Mechanical Engineering",
                        value: "Mechanical Engineering",
                      },
                      { label: "Cybersecurity", value: "Cybersecurity" },
                      {
                        label: "Information Systems Technology",
                        value: "Information Systems Technology",
                      },
                      {
                        label: "Applied Computing",
                        value: "Applied Computing",
                      },
                      {
                        label: "Business Administration",
                        value: "Business Administration",
                      },
                    ]}
                    allowCustomInput
                    closeOnSelect
                    multiselect
                  />
                </>
              )}
            </div>
            {!showChaperoneFields && (
              <ComboboxSelect
                name="minor"
                label="Minor(s) / Certificate(s)"
                required={isFieldRequired("minor")}
                placeholder="Select your minor(s)"
                options={[
                  { label: "Psychology", value: "Psychology" },
                  { label: "Biology", value: "Biology" },
                  { label: "Mathematics", value: "Mathematics" },
                  { label: "Physics", value: "Physics" },
                  { label: "Chemistry", value: "Chemistry" },
                  { label: "Philosophy", value: "Philosophy" },
                  { label: "Music", value: "Music" },
                  { label: "Art", value: "Art" },
                  { label: "Dance", value: "Dance" },
                  { label: "Theatre", value: "Theatre" },
                  { label: "Film", value: "Film" },
                  { label: "Journalism", value: "Journalism" },
                  { label: "History", value: "History" },
                  { label: "Sociology", value: "Sociology" },
                  { label: "Political Science", value: "Political Science" },
                  {
                    label: "African & African-American Studies",
                    value: "African & African-American Studies",
                  },
                  { label: "Economics", value: "Economics" },
                  { label: "Geography", value: "Geography" },
                  {
                    label: "Environmental Studies",
                    value: "Environmental Studies",
                  },
                  {
                    label: "Global & International Studies",
                    value: "Global & International Studies",
                  },
                ]}
                allowCustomInput
                multiselect
                closeOnSelect
              />
            )}

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
            <FormInputField
              name="dietaryRestrictions"
              label="Dietary Restrictions"
              placeholder="Enter any dietary restrictions"
              required={isFieldRequired("dietaryRestrictions")}
            />
            <div>
              <p className="mb-2 text-sm">
                When planning HackKU25, inclusivity is our top priority! How can
                we best accommodate you for the best hackathon experience
                possible?
              </p>
              <FormInputField
                name="specialAccommodations"
                label=""
                placeholder="Enter any special accommodations"
                required={isFieldRequired("specialAccommodations")}
              />
            </div>

            {/* Agreements Section */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Agreements</h2>
            <div className="space-y-4">
              <FormCheckboxField
                name="agreeHackKUCode"
                label={
                  <>
                    I agree to the{" "}
                    <Link
                      href="/legal/code-of-conduct"
                      className="underline"
                      target="_blank"
                    >
                      HackKU Code of Conduct
                    </Link>
                    .
                  </>
                }
                required={isFieldRequired("agreeHackKUCode")}
              />
              <FormCheckboxField
                name="photoWaiver"
                label={
                  <>
                    {form.getValues().levelOfStudy === "High School" ? (
                      <>
                        I certify that I am the parent or guardian of the
                        participant and consent to the terms of the{" "}
                        <Link
                          href="/legal/waiver"
                          className="underline"
                          target="_blank"
                        >
                          HackKU Waiver / Photo Release Waiver
                        </Link>{" "}
                        on their behalf.{" "}
                      </>
                    ) : (
                      <>
                        I agree to the{" "}
                        <Link
                          href="/legal/waiver"
                          className="underline"
                          target="_blank"
                        >
                          HackKU Waiver / Photo Release
                        </Link>
                      </>
                    )}
                  </>
                }
                required={true}
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
                    . I agree to the{" "}
                    <Link
                      href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                      target="_blank"
                      className="underline"
                    >
                      MLH Contest Terms
                    </Link>
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
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Register!
            </Button>
          </form>
        </FormProvider>
        <p className="text-xs text-center mt-4 text-gray-500">
          Have questions? Join the{" "}
          <Link href={constants.discordInvite} className="underline">
            Discord Server
          </Link>{" "}
          or email us at{" "}
          <Link href={`mailto:${constants.supportEmail}`} className="underline">
            {constants.supportEmail}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
