import React, { useState, useCallback } from 'react';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { ImageUploader } from './components/ImageUploader';
import { PasswordGate } from './components/PasswordGate';
import { generateTransmutedImage } from './services/geminiService';
import { AppStatus, GeneratedImage, StylePreset } from './types';
import { STYLE_PRESETS } from './constants';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<GeneratedImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [detectedRatio, setDetectedRatio] = useState<string>("1:1");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);

  const cleanBase64 = (dataUrl: string) => {
    return dataUrl.split(',')[1] || dataUrl;
  };

  /**
   * Detects the closest supported Gemini aspect ratio based on pixel dimensions
   */
  const detectAspectRatio = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        
        // Gemini Supported Enums: 1:1, 4:3, 3:4, 16:9, 9:16
        if (ratio > 1.5) resolve("16:9");
        else if (ratio > 1.1) resolve("4:3");
        else if (ratio < 0.6) resolve("9:16");
        else if (ratio < 0.9) resolve("3:4");
        else resolve("1:1");
      };
      img.src = base64;
    });
  };

  const processImage = useCallback(async (base64Input: string, ratio: string) => {
    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const cleanInput = cleanBase64(base64Input);
      const processedImage = await generateTransmutedImage(cleanInput, selectedStyle.prompt, ratio);

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
  }, [selectedStyle]);

  const handleImageSelect = useCallback(async (base64: string) => {
    setPreviewImage(base64);
    const ratio = await detectAspectRatio(base64);
    setDetectedRatio(ratio);
    setStatus(AppStatus.IDLE);
  }, []);

  const handleStartProcessing = () => {
    if (previewImage) {
        processImage(previewImage, detectedRatio);
    }
  };

  const handleClearPreview = () => {
      setPreviewImage(null);
      setStatus(AppStatus.IDLE);
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setImages(null);
    setPreviewImage(null);
    setErrorMsg(null);
  };

  const handleLock = () => {
    setIsAuthorized(false);
  };

  const handleDownload = useCallback(() => {
    if (!images?.processed) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        try {
          const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.download = `visible-genius-${selectedStyle.id}.jpg`;
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
    img.src = images.processed;
  }, [images, selectedStyle]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FDFBF7]">
      <div 
        className={`flex w-[200vw] h-full transition-transform duration-[800ms] ease-in-out ${isAuthorized ? '-translate-x-1/2' : 'translate-x-0'}`}
      >
        <div className="w-screen h-full flex-shrink-0">
          <PasswordGate onAuthorized={() => setIsAuthorized(true)} />
        </div>

        <div className="w-screen h-full flex-shrink-0 overflow-y-auto overflow-x-hidden">
          {!apiKeyReady ? (
            <div className="min-h-full flex flex-col items-center justify-center p-4 bg-[#FDFBF7] relative overflow-hidden">
              <header className="w-full max-w-4xl mx-auto py-12 text-center relative z-10">
                  <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-4 uppercase">
                  Visible<span className="text-[#D02020]">Genius</span>
                  </h1>
              </header>
              <ApiKeyChecker onReady={() => setApiKeyReady(true)} />
            </div>
          ) : (
            <div className="min-h-full bg-[#FDFBF7] text-neutral-900 flex flex-col selection:bg-[#F0C020]">
              <header className="w-full border-b-4 border-black bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex gap-1">
                            <div className="w-4 h-4 md:w-6 md:h-6 bg-[#D02020] border-2 border-black"></div>
                            <div className="w-4 h-4 md:w-6 md:h-6 bg-[#1040A0] border-2 border-black rounded-full"></div>
                            <div className="w-4 h-4 md:w-6 md:h-6 bg-[#F0C020] border-2 border-black transform rotate-45"></div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tighter uppercase whitespace-nowrap">
                            Visible<span className="text-neutral-400">Genius</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 md:px-4 md:py-2 border-2 border-black bg-black text-white font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold shadow-[4px_4px_0px_0px_#F0C020]">
                            System Ready
                        </div>
                        <button 
                          onClick={handleLock}
                          className="p-1.5 md:p-2 border-2 border-black bg-white hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                    </div>
                </div>
              </header>

              <main className="flex-grow flex flex-col items-center px-6 py-8 w-full max-w-7xl mx-auto relative">
                {status === AppStatus.IDLE && !previewImage && (
                  <div className="w-full flex flex-col items-center space-y-8 md:space-y-12 animate-fade-in-up max-w-4xl z-10">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Form follows Function</h2>
                        <p className="text-neutral-500 max-w-md mx-auto uppercase text-[10px] md:text-xs font-bold tracking-[0.2em]">upload photo and select formula</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
                        <div className="lg:col-span-7">
                            <ImageUploader onImageSelected={handleImageSelect} isLoading={false} />
                        </div>
                        
                        <div className="lg:col-span-5 flex flex-col space-y-4">
                            <div className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest flex justify-between items-center">
                                <span>Formula Index</span>
                                <div className="w-2 h-2 bg-[#F0C020] rounded-full"></div>
                            </div>
                            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <ul className="space-y-4">
                                    {STYLE_PRESETS.map((style, idx) => (
                                        <li key={style.id} className="group border-b-2 border-black/5 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-3">
                                                <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">0{idx + 1}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-sm uppercase tracking-tight group-hover:text-[#1040A0] transition-colors">{style.label}</span>
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 leading-tight">{style.description}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-2 text-[10px] font-mono text-neutral-400 uppercase tracking-tighter">
                                // System detected ratio sync enabled
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {status === AppStatus.IDLE && previewImage && (
                     <div className="w-full max-w-5xl bg-white border-4 border-black p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-8 md:gap-12 z-10 animate-fade-in relative">
                        <div className="w-full lg:w-1/2 flex flex-col">
                            <div className="text-xs font-mono font-bold uppercase mb-2 border-b-2 border-black pb-1">Input Source</div>
                            <div className="relative group w-full bg-neutral-100 border-2 border-black p-4 flex-grow flex items-center justify-center min-h-[250px]">
                                <img src={previewImage} alt="Preview" className="max-h-[300px] md:max-h-[400px] w-auto object-contain" />
                                <div className="absolute bottom-6 left-6 bg-black text-white px-2 py-1 text-[10px] font-mono font-bold">DETECTED RATIO: {detectedRatio}</div>
                                <button onClick={handleClearPreview} className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-[#D02020] hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 leading-none">Configuration<br/>Parameters</h3>
                                <div className="w-full space-y-2">
                                    <label className="block text-xs font-bold text-black uppercase tracking-widest">Visual Protocol</label>
                                    <div className="relative">
                                        <select
                                            value={selectedStyle.id}
                                            onChange={(e) => {
                                              const style = STYLE_PRESETS.find(s => s.id === e.target.value);
                                              if (style) setSelectedStyle(style);
                                            }}
                                            className="w-full appearance-none bg-white text-black border-4 border-black py-3 px-4 md:py-4 md:px-6 focus:outline-none font-bold text-sm md:text-lg uppercase"
                                        >
                                            {STYLE_PRESETS.map((preset) => (
                                              <option key={preset.id} value={preset.id}>{preset.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t-4 border-black border-dotted">
                                <button onClick={handleStartProcessing} className="w-full group relative flex items-center justify-center px-6 py-4 font-black text-white text-lg md:text-xl uppercase tracking-wider bg-[#1040A0] border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all">
                                    <span>Initiate Transmutation</span>
                                </button>
                            </div>
                        </div>
                     </div>
                )}

                {status === AppStatus.PROCESSING && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-10">
                     <div className="relative w-24 h-24 md:w-32 md:h-32">
                        <div className="absolute inset-0 border-8 border-black animate-spin"></div>
                        <div className="absolute inset-[35%] bg-black"></div>
                     </div>
                     <div className="text-center space-y-4 px-6">
                        <h3 className="text-3xl md:text-4xl font-black text-black uppercase">Constructing</h3>
                        <div className="flex flex-col gap-2 items-center">
                            <div className="inline-block bg-[#F0C020] px-4 py-1 border-2 border-black font-mono font-bold text-xs uppercase">PROTOCOL: {selectedStyle.label}</div>
                            <div className="inline-block bg-white px-4 py-1 border-2 border-black font-mono font-bold text-xs uppercase">RATIO: {detectedRatio}</div>
                        </div>
                     </div>
                  </div>
                )}

                {status === AppStatus.ERROR && (
                  <div className="bg-[#D02020] text-white border-4 border-black p-8 md:p-12 text-center max-w-lg mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-2xl md:text-3xl font-black uppercase mb-4">System Failure</h3>
                    <p className="font-mono text-sm mb-8 border-t-2 border-b-2 border-white/30 py-4">{errorMsg}</p>
                    <button onClick={handleReset} className="px-8 py-3 bg-white text-black font-bold uppercase border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Re-Initialize</button>
                  </div>
                )}

                {status === AppStatus.SUCCESS && images && (
                  <div className="w-full max-w-7xl animate-fade-in flex flex-col gap-8 md:gap-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                            <span className="font-black text-lg md:text-xl uppercase border-b-4 border-black pb-2 block">Figure A: Source</span>
                            <div className="bg-white p-4 border-4 border-black">
                                <img src={images.original} alt="Original" className="w-full h-auto object-contain filter grayscale opacity-90" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="font-black text-lg md:text-xl uppercase border-b-4 border-[#1040A0] pb-2 block text-[#1040A0]">Figure B: Output</span>
                            <div className="bg-white p-4 border-4 border-[#1040A0] shadow-[10px_10px_0px_0px_#1040A0]">
                                <img src={images.processed} alt="Processed" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 border-t-4 border-black border-dashed">
                       <button onClick={handleDownload} className="bg-[#1040A0] text-white border-4 border-black px-8 py-4 font-black text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                         Download Output
                       </button>
                       <button onClick={handleReset} className="bg-white text-black border-4 border-black px-8 py-4 font-black text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                         Reset System
                       </button>
                    </div>
                    <div className="text-center text-neutral-500 text-[10px] font-mono uppercase tracking-widest max-w-lg mx-auto bg-white px-4 py-2 border border-black">
                        Status: Rendering Complete ({detectedRatio} @ 1K).
                    </div>
                  </div>
                )}
              </main>
              
              <footer className="w-full py-8 text-center text-black font-bold uppercase tracking-widest text-[10px] border-t-4 border-black bg-white">
                <p>ENGINEERED BY RON RADOM // VISIBLE GENIUS v0.4</p>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;