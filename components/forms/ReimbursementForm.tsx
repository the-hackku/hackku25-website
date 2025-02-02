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

  //first name
  //last name
  //phone number - make sure phone number is right amount of characters
  //email - make sure valid email

  //transportation method: car, plane, bus

  //distance from starting location and KU Engineering (in miles)

  //estimated ticket/gas payment (in dollars)


  //optional fields:

  //address (traveling from)
  //address 2 (traveling from)
  //city/town
  //state/province/region
  //zip/post code 
  //country


  return (<div>

  </div>);
}
