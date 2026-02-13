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
        console.warn("window.aistudio not found. Assuming dev environment.");
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
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="w-12 h-12 border-b-4 border-r-4 border-black rounded-full animate-spin border-t-transparent border-l-transparent"></div>
        <p className="text-black font-mono font-bold uppercase tracking-widest">Verifying Access</p>
      </div>
    );
  }

  if (hasKey) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto mt-20 relative">
      <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#F0C020] border-4 border-black"></div>
      <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-[#D02020] border-4 border-black"></div>

      <div className="p-6 bg-white border-4 border-black rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-3xl font-black text-black mb-4 uppercase">Access Required</h2>
        <p className="text-neutral-600 font-medium">
          To utilize the Nano Banana Pro engine, a Google Cloud Project API key is mandatory.
        </p>
      </div>

      <button
        onClick={handleSelectKey}
        className="px-8 py-4 bg-[#1040A0] text-white font-bold text-lg border-4 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
      >
        CONNECT KEY
      </button>

      {error && <div className="bg-[#D02020] text-white p-2 font-bold w-full border-2 border-black">{error}</div>}
      
      <p className="text-xs text-neutral-500 mt-4 border-t-2 border-neutral-200 pt-4 w-full">
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:bg-[#F0C020] hover:text-black px-1">
          Review Billing Documentation
        </a>
      </p>
    </div>
  );
};