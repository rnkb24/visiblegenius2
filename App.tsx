import React, { useState, useCallback } from 'react';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { ImageUploader } from './components/ImageUploader';
import { generateTransmutedImage } from './services/geminiService';
import { AppStatus, GeneratedImage } from './types';
import { SECRET_PROMPT } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  // Strip prefix for API call
  const cleanBase64 = (dataUrl: string) => {
    return dataUrl.split(',')[1] || dataUrl;
  };

  const processImage = useCallback(async (base64Input: string) => {
    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const cleanInput = cleanBase64(base64Input);
      const processedImage = await generateTransmutedImage(cleanInput, SECRET_PROMPT);

      setImages({
        original: base64Input,
        processed: processedImage,
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      setErrorMsg(err.message || "Something went wrong during transmutation.");
    }
  }, []);

  const handleImageSelect = useCallback((base64: string) => {
    processImage(base64);
  }, [processImage]);

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setImages(null);
    setErrorMsg(null);
  };

  const handleDownload = useCallback(() => {
    if (!images?.processed) return;

    const img = new Image();
    // For local base64 data URIs, crossOrigin is strictly not needed and can sometimes cause issues
    // if the browser treats data URIs as 'null' origin. Removing it is safer for base64.
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill white background to ensure no transparency issues in JPEG conversion
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        try {
          // Convert to JPEG with high quality
          const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.download = 'visible-genius-output-2k.jpg';
          link.href = jpegUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error("Download failed:", e);
          alert("Failed to generate JPEG download link.");
        }
      }
    };

    img.onerror = (e) => {
      console.error("Error loading image for download:", e);
      alert("Could not process image for download.");
    };

    // Set src AFTER setting onload to avoid race conditions
    img.src = images.processed;
  }, [images]);

  if (!apiKeyReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4">
        <header className="w-full max-w-4xl mx-auto py-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4 tracking-tight">
            VisibleGenius
            </h1>
        </header>
        <ApiKeyChecker onReady={() => setApiKeyReady(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="w-full max-w-4xl mx-auto py-10 px-4 text-center">
        <div className="inline-flex items-center space-x-2 mb-4 bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-800">
           <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
           <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Nano Banana Pro Active</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mb-6 tracking-tight">
          VisibleGenius
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload any image and watch as our <span className="text-indigo-400 font-semibold">secret AI protocol</span> re-imagines it.
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center px-4 pb-12 w-full max-w-6xl mx-auto">
        
        {/* IDLE & UPLOADING STATE */}
        {status === AppStatus.IDLE && (
          <div className="w-full animate-fade-in-up">
            <ImageUploader onImageSelected={handleImageSelect} isLoading={false} />
          </div>
        )}

        {/* PROCESSING STATE */}
        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-pulse">
             <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Transmuting Reality...</h3>
                <p className="text-slate-400">Rendering 2K High-Fidelity Output (4:3)</p>
                <p className="text-xs text-slate-500 font-mono">Model: gemini-3-pro-image-preview</p>
             </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === AppStatus.ERROR && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Transmutation Failed</h3>
            <p className="text-red-300 mb-6">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === AppStatus.SUCCESS && images && (
          <div className="w-full space-y-8 animate-fade-in">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Original */}
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                        {/* Aspect ratio container handled by img native size or explicit class if known */}
                        <img 
                            src={images.original} 
                            alt="Original" 
                            className="w-full h-auto object-contain max-h-[600px] mx-auto"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                            Original
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 relative">
                        <img 
                            src={images.processed} 
                            alt="Processed" 
                            className="w-full h-auto object-contain max-h-[600px] mx-auto"
                        />
                         <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"></path></svg>
                            2K Processed
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 border-t border-slate-800/50">
               <button 
                 type="button"
                 onClick={handleDownload}
                 className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 w-full md:w-auto justify-center"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 <span>Download 2K JPG</span>
               </button>
               
               <button 
                 type="button"
                 onClick={handleReset}
                 className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-4 rounded-xl font-semibold transition-all w-full md:w-auto justify-center"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 <span>Process Another</span>
               </button>
            </div>
            
            <div className="text-center text-slate-500 text-sm max-w-lg mx-auto">
               <p>The system is now generating high-resolution 2K images with specific cinematic grading. This may take a few extra seconds.</p>
            </div>

          </div>
        )}

      </main>
      
      <footer className="w-full py-6 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>Powered by Gemini 3 Pro Vision (Nano Banana Pro)</p>
      </footer>
    </div>
  );
};

export default App;