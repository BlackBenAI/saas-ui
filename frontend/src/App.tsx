import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeSync } from "@/components/ThemeSync";

const EditorPage = lazy(() =>
  import("@/pages/EditorPage").then((module) => ({ default: module.EditorPage })),
);
const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then((module) => ({ default: module.LandingPage })),
);
const ProjectsPage = lazy(() =>
  import("@/pages/ProjectsPage").then((module) => ({ default: module.ProjectsPage })),
);


function LegacyEditorRedirect() {
  const { module } = useParams();
  return <Navigate to={module && module !== "overview" ? `/dashboard/${module}` : "/dashboard"} replace />;
}

export default function App() {
  return (
    <HelmetProvider>
        <BrowserRouter>
          <ThemeSync />
          <Suspense
            fallback={
              <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<EditorPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/dashboard/:module" element={<EditorPage />} />
              <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
              <Route path="/editor/:module" element={<LegacyEditorRedirect />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
            },
          }}
        />
    </HelmetProvider>
  );
}
