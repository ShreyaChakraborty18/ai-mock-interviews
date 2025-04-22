"use client"; // This directive is used in Next.js to indicate that this component is client-side only.

// Importing necessary libraries and components
import { z } from "zod"; // Zod is a TypeScript-first schema declaration and validation library.
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod with React Hook Form for validation.
import { useForm } from "react-hook-form"; // A library for managing forms in React.

import { Button } from "@/components/ui/button"; // Custom Button component.
import { Form } from "@/components/ui/form"; // Custom Form wrapper component.

import Image from "next/image"; // Next.js optimized image component.
import Link from "next/link"; // Next.js component for client-side navigation.
import { toast } from "sonner"; // A library for displaying toast notifications.
import FormField from "./FormField"; // Custom reusable form field component.
import { useRouter } from "next/navigation"; // Next.js hook for programmatic navigation.
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";

// Function to define the schema for form validation based on the form type (sign-in or sign-up).
const authFormSchema = (type: FormType) => {
  return z.object({
    // If the form type is "sign-up", the name field is required and must have at least 3 characters.
    // Otherwise, the name field is optional.
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(), // Email field must be a valid email address.
    password: z.string().min(3), // Password field must have at least 3 characters.
  });
};

// Main AuthForm component
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter(); // Hook for navigating between pages programmatically.
  const formSchema = authFormSchema(type); // Generate the validation schema based on the form type.

  // Initialize the form using React Hook Form and Zod for validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use Zod for validation.
    defaultValues: {
      name: "", // Default value for the name field.
      email: "", // Default value for the email field.
      password: "", // Default value for the password field.
    },
  });

  // Function to handle form submission.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // Logic for sign-up
        const { name, email, password } = values; // Destructure the form values.

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid, // Get the user ID from Firebase Auth.
          name: name!, // Get the name from the form values.
          email, // Get the email from the form values.
          password: password, // Get the password from the form values.
        });
        if (!result?.success) {
          toast.error(result.message); // Show an error toast message if sign-up fails.
          return;
        }

        // Logic for successful sign-up
        toast.success("Account created successfully. Please sign in."); // Show a success toast message.
        router.push("/sign-in"); // Redirect the user to the sign-in page.

      } else {
        // Logic for sign-in
        const { email, password } = values; // Destructure the form values.
        const userCredential = await signInWithEmailAndPassword(
          auth, email, password)

        const idToken = await userCredential.user.getIdToken(); // Get the ID token from Firebase Auth.

        if(!idToken) {
          toast.error("Sign in Failed. Please try again."); // Show an error toast message if ID token retrieval fails.
          return;
        }

        await signIn({ email, idToken }); // Call the signIn function with the email and ID token.

        toast.success("Success! You are now signed in."); // Show a success toast message.
        router.push("/"); // Redirect the user to the home page.
      }

    } catch (error) {
      console.log(error); // Log any errors for debugging.
      toast.error(`There was some error: ${error}`); // Show an error toast message.
    }
  }

  // Determine if the form is for sign-in based on the type prop.
  const isSignIn = type === "sign-in";

  return (
    // Outer container with a styled border.
    <div className="card-border lg:min-w-[566px]">
      {/* Inner card container with padding and spacing */}
      <div className="flex flex-col gap-6 card py-14 px-10">
        {/* Logo and title */}
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />{" "}
          {/* Logo */}
          <h2 className="text-primary-100">PrepView</h2> {/* App title */}
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>{" "}
        {/* Subtitle */}
        {/* Form component */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)} // Handle form submission.
            className="w-full space-y-6 mt-4 form" // Styling for the form.
          >
            {/* Show the name field only if the form is for sign-up */}
            {!isSignIn && (
              <FormField
                control={form.control} // Pass the form control for React Hook Form.
                name="name" // Field name.
                label="Name" // Field label.
                placeholder="Your Name" // Placeholder text.
              />
            )}
            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            {/* Submit button */}
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}{" "}
              {/* Button text changes based on form type */}
            </Button>
          </form>
        </Form>
        {/* Link to switch between sign-in and sign-up */}
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}{" "}
          {/* Conditional text */}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"} // Link to the opposite form type.
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"} {/* Link text */}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm; // Export the component for use in other parts of the app.
