"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { registerUser } from "@/app/actions/register";
import { formSchema, RegistrationData } from "@/app/actions/schemas"; // Importing schema and type from schemas.ts
import { ComboboxSelect } from "@/components/customui/ComboSelect";
import debounce from "lodash/debounce"; // If using lodash for debouncing
import throttle from "lodash/throttle";
import { toast } from "sonner";
import { Progress } from "../ui/progress";

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
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false); // Track if currently saving

  const LOCAL_STORAGE_KEY = "registrationFormData";
  const SAVE_INTERVAL_MS = 1000; // Save every 1 second

  const router = useRouter();

  // Initialize React Hook Form using the imported `formSchema`
  const form = useForm<RegistrationData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      age: undefined,
      genderIdentity: undefined,
      race: "",
      hispanicOrLatino: undefined,
      countryOfResidence: undefined,
      tShirtSize: undefined,
      dietaryRestrictions: "",
      specialAccommodations: "",
      isHighSchoolStudent: false,
      currentSchool: "",
      levelOfStudy: undefined,
      major: "",
      previousHackathons: undefined,
      chaperoneFirstName: "",
      chaperoneLastName: "",
      chaperoneEmail: "",
      chaperonePhoneNumber: "",
      agreeHackKUCode: false,
      agreeMLHCode: false,
      shareWithMLH: false,
      receiveEmails: false,
    },
  });

  // Function to format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const formatted = [
      match[1] ? `(${match[1]}` : "",
      match[2] ? `) ${match[2]}` : "",
      match[3] ? `-${match[3]}` : "",
    ].join("");
    return formatted;
  };

  // Calculate progress and check form validity on component mount and updates
  useEffect(() => {
    const calculateProgress = () => {
      const values = form.getValues();
      const requiredFields = [
        "firstName",
        "lastName",
        "phoneNumber",
        "age",
        "countryOfResidence",
        "tShirtSize",
        "agreeHackKUCode",
        "agreeMLHCode",
      ];
      const filledFields = requiredFields.reduce((count, key) => {
        const value = values[key as keyof RegistrationData];
        return value ? count + 1 : count;
      }, 0);

      let calculatedProgress = Math.round(
        (filledFields / requiredFields.length) * 100
      );

      if (calculatedProgress === 100 && form.formState.isValid) {
        calculatedProgress = 100;
      } else {
        calculatedProgress = Math.min(calculatedProgress, 95);
      }

      setProgress(calculatedProgress);
    };

    calculateProgress(); // Initial calculation on mount
    const subscription = form.watch(calculateProgress);
    return () => subscription.unsubscribe();
  }, [form]);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData && typeof parsedData === "object") {
        form.reset(parsedData);
        setLastSaved(parsedData.lastSaved || null);
      }
    }
  }, [form]);

  // Save form data to localStorage every second (throttled)
  const saveData = throttle((data) => {
    const timestamp = new Date().toISOString();
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...data, lastSaved: timestamp })
    );
    setLastSaved(timestamp);
  }, SAVE_INTERVAL_MS);

  // Debounced function to update `saving` state after 1 second delay
  const debouncedSave = debounce(() => {
    setSaving(false); // Show saved state
  }, 1000);

  // Watch form for changes and handle save
  useEffect(() => {
    const subscription = form.watch((value) => {
      setSaving(true); // Start saving text immediately
      saveData(value); // Save every second
      debouncedSave(); // Set saving false 1 second after typing stops
    });

    return () => {
      subscription.unsubscribe();
      saveData.cancel();
      debouncedSave.cancel();
    };
  }, [form.watch, form]);

  const onSubmit = async (data: RegistrationData) => {
    try {
      await registerUser(data);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      form.reset();
      toast.success("Registration successful!");
      router.refresh();
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

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-center text-xl py-4">
            HackKU 2025 Registration{" "}
            <span className="text-sm text-gray-500">
              {saving
                ? `Saving...` // Show 'Saving...' if in progress
                : lastSaved
                ? `Saved at ${new Date(lastSaved).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}`
                : "Not saved"}
            </span>
          </CardTitle>
          <span className="text-sm font-medium">{progress}% Completed</span>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            {/* Personal Information Section */}
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number"
                        value={formatPhoneNumber(field.value)}
                        onChange={(e) =>
                          field.onChange(formatPhoneNumber(e.target.value))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Age"
                        value={
                          field.value !== undefined ? String(field.value) : ""
                        }
                        onChange={(e) => {
                          const valueAsNumber = e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined;
                          field.onChange(valueAsNumber);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genderIdentity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Gender Identity</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value || undefined)
                        } // Ensure `undefined` is passed when no value is selected
                        value={field.value || ""} // Show empty string when `undefined`
                      >
                        <SelectTrigger className="w-full">
                          {field.value || "Select..."}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-binary">Non-binary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to Answer">
                            Prefer not to Answer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Race</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          {field.value || "Select..."}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Black or African American">
                            Black or African American
                          </SelectItem>
                          <SelectItem value="Asian">Asian</SelectItem>
                          <SelectItem value="Native Hawaiian or Other Pacific Islander">
                            Native Hawaiian or Other Pacific Islander
                          </SelectItem>
                          <SelectItem value="American Indian or Alaska Native">
                            American Indian or Alaska Native
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to answer">
                            Prefer not to answer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hispanicOrLatino"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Are you Hispanic or Latino?</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          {field.value || "Select..."}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Prefer not to answer">
                            Prefer not to answer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Divider */}
            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Educational Information</h2>
            <ComboboxSelect
              name="currentSchool"
              label="Current School"
              placeholder="Select your school"
              options={predefinedSchools}
              allowCustomInput
              closeOnSelect
            />

            <div className="flex items-end space-x-4">
              <FormField
                control={form.control}
                name="levelOfStudy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Level of Study</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowChaperoneFields(value === "High School");
                        }}
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          {field.value || "Select..."}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Undergraduate">
                            Undergraduate
                          </SelectItem>
                          <SelectItem value="High School">
                            High School
                          </SelectItem>

                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {!showChaperoneFields && (
                <div className="flex-1">
                  <ComboboxSelect
                    name="major"
                    label="Major"
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
                </div>
              )}
            </div>

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
                  <FormField
                    control={form.control}
                    name="chaperoneFirstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Chaperone First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Chaperone's first name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chaperoneLastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Chaperone Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Chaperone's last name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="chaperoneEmail"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Chaperone Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Chaperone's email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chaperonePhoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Chaperone Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Chaperone's phone number"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {/* Divider */}
            <hr className="my-4" />
            {/* Additional Information Section */}
            <h2 className="text-lg font-semibold">Additional Information</h2>
            <ComboboxSelect
              name="countryOfResidence"
              label="Country of Residence"
              placeholder="Select your country"
              options={[
                { label: "United States", value: "United States" },
                { label: "Canada", value: "Canada" },
                { label: "India", value: "India" },
              ]}
              allowCustomInput
              closeOnSelect
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dietary Restrictions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter any dietary restrictions"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialAccommodations"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Please list any accommodations you need
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter any special accommodations"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tShirtSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>T-Shirt Size</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        {field.value || "Select..."}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">Small</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="L">Large</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousHackathons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many Hackathons have you attended?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter the number of previous hackathons"
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
                      onChange={(e) => {
                        const valueAsNumber = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        field.onChange(valueAsNumber);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Divider */}
            <hr className="my-4" />
            {/* Agreements Section */}
            <h2 className="text-lg font-semibold mb-2">Agreements</h2>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="agreeHackKUCode"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormLabel className="leading-tight">
                      I agree to the HackKU Code of Conduct.
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeMLHCode"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormLabel className="leading-tight">
                      I agree to the MLH Code of Conduct.
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shareWithMLH"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-3">
                    <FormControl>
                      <Checkbox
                        {...field}
                        value={field.value ? "true" : "false"}
                      />
                    </FormControl>
                    <FormLabel className="leading-tight">
                      I authorize sharing my registration with MLH.
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiveEmails"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-3">
                    <FormControl>
                      <Checkbox
                        {...field}
                        value={field.value ? "true" : "false"}
                      />
                    </FormControl>
                    <FormLabel className="leading-tight">
                      I agree to receive emails about opportunities from MLH.
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}

            {/* Progress bar above the submit button */}
            <Progress value={progress} className="w-full h-2 mb-2" />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
