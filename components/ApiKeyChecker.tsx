import React, { useEffect, useState, useCallback } from 'react';

interface ApiKeyCheckerProps {
  onReady: () => void;
}

export const ApiKeyChecker: React.FC<ApiKeyCheckerProps> = ({ onReady }) => {
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkKey = useCallback(async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected) {
          setHasKey(true);
          onReady();
        } else {
          setHasKey(false);
        }
      } else {
        // Fallback for dev environments without the special window object,
        // though strictly we expect this to run in the specific environment.
        console.warn("window.aistudio not found. Assuming dev environment with env var or failure.");
        if (process.env.API_KEY) {
            setHasKey(true);
            onReady();
        } else {
            setError("AI Studio environment not detected.");
        }
      }
    } catch (e) {
      console.error("Error checking API key:", e);
      setError("Failed to verify API Key status.");
    } finally {
      setLoading(false);
    }
  }, [onReady]);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assuming success after returning from the dialog
        setHasKey(true);
        onReady();
      }
    } catch (e) {
      console.error("Error opening key selector:", e);
      setError("Failed to open key selector.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Verifying access...</p>
      </div>
    );
  }

  if (hasKey) {
    return null; // Render nothing if key is present, allowing parent to show content
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-md mx-auto mt-20">
      <div className="p-4 bg-indigo-500/10 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
        <p className="text-slate-400">
          To use the Nano Banana Pro image model, you need to connect your paid Google Cloud Project API key.
        </p>
      </div>

      <button
        onClick={handleSelectKey}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
      >
        Connect API Key
      </button>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      
      <p className="text-xs text-slate-500 mt-4">
        Review billing details at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">ai.google.dev/gemini-api/docs/billing</a>
      </p>
    </div>
  );
};