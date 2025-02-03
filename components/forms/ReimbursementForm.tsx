"use client";

import { useForm, FormProvider } from "react-hook-form";
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

/*import {
  predefinedCountries,
  predefinedMajors,
  predefinedMinors,
  predefinedSchools,
  raceOptions,
} from "./predefinedOptions";
*/

//const LOCAL_STORAGE_KEY = "hackku25_registration_form";

export function ReimbursementForm() {
  const [showChaperoneFields, setShowChaperoneFields] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  //type Transportation = NonNullable<RegistrationData["Transportation"]>;

  // Define options with correct typing for the transportation method
  /*
  const TransportationOptions: { label: string; value: Transportation }[] = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Non-binary", value: "Non-binary" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to Answer", value: "Prefer not to Answer" },
  ];
*/

  //fields required for form:
  //spaces represent tab separated parts

  /*
  const onSubmit = async (data: RegistrationData) => {
    try {
      await registerUser(data);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear saved data
      router.push("/profile");
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error(
        "Registration failed, please try again. Please contact support if the issue persists."
      );
    }
  };*/

  return (
  <Card className="max-w-3xl mx-auto mt-2 border-none shadow-none">


    {/*Fill with information about reimbursement form*/}
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-center text-xl py-4">
          HackKU25 Reimbursement Form
        </CardTitle>

        <span className="text-sm font-medium">
          {progress}% Complete (Saved)
        </span>
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
      {/*Begin form here*/}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >

          {/* Personal Information Section */}
          {/*  
            //first name
            //last name
            //phone number - make sure phone number is right amount of characters
            //email - make sure valid email 
          */}
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="flex space-x-4">
            {personalInfoFields.slice(0, 2).map((field) => (
              <FormInputField key={field.name} {...field} />
            ))}
          </div>
          <div className="flex space-x-4">
            {personalInfoFields.slice(2).map((field) => (
              <FormInputField key={field.name} {...field} />
            ))}
          </div>

          {/* Address Information Section */}
          <h2>Address Information</h2>
          <div>
            {/*address (traveling from)
            //address 2 (traveling from)
            //city/town
            //state/province/region
            //zip/post code 
            //country*/}

          </div>

          {/* Transportation Information Section */}
          <h2>Transportation Information</h2>
          
          {/*transportation method: car, plane, bus*/}

          <div>

          </div>

          {/* Distance and Gas Section */}
          <hr className="my-4" />
          <h2 className="text-lg font-semibold">Distance and Gas Information</h2>


          {/*
            //distance from starting location and KU Engineering (in miles)

            //estimated ticket/gas payment (in dollars) 
          */}

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
