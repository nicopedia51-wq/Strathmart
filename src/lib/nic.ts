// StrathMart Error Reporting Utility
type ErrorReportOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Hapa sasa tunalog makosa ndani ya mfumo wetu badala ya kutuma Lovable
  const errorDetails = {
    source: "react_error_boundary",
    route: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.error(" [StrathMart Error Security Shield]:", error, errorDetails);

  // BAADAYE: Kama timu yako ikitaka kuunganisha na mfumo wa backend au Sentry, 
  // utaweka fetch au API call yako hapa chini:
  // fetch('/api/logs', { method: 'POST', body: JSON.stringify({ error, errorDetails }) });
}

// Re-export kwa ajili ya backwards compatibility kwenye mafaili mengine
export const reportLovableError = reportError;