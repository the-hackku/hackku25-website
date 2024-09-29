import SplashPage from "@/pages/SplashPage";

// Server component - `async` components are treated as server components
export default async function HomePage() {
  // Get the session to check if the user is authenticated
  return <SplashPage />;
}
