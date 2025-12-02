import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/core/presentation/context/AuthContext";
import { router } from "@/lib/routes";
import { Toaster } from "@/components/ui/toaster";

/**
 * Root Application Component
 * Sets up providers and router
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="hospital-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
