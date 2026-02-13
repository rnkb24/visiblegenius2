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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);

  const cleanBase64 = (dataUrl: string) => {
    return dataUrl.split(',')[1] || dataUrl;
  };

  const processImage = useCallback(async (base64Input: string) => {
    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const cleanInput = cleanBase64(base64Input);
      const processedImage = await generateTransmutedImage(cleanInput, selectedStyle.prompt);

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

  const handleImageSelect = useCallback((base64: string) => {
    setPreviewImage(base64);
    setStatus(AppStatus.IDLE);
  }, []);

  const handleStartProcessing = () => {
    if (previewImage) {
        processImage(previewImage);
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

    img.onerror = (e) => {
      console.error("Error loading image for download:", e);
      alert("Could not process image for download.");
    };

    img.src = images.processed;
  }, [images, selectedStyle]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FDFBF7]">
      <div 
        className={`flex w-[200vw] h-full transition-transform duration-[800ms] ease-in-out ${isAuthorized ? '-translate-x-1/2' : 'translate-x-0'}`}
      >
        {/* VIEW 1: PASSWORD GATE */}
        <div className="w-screen h-full flex-shrink-0">
          <PasswordGate onAuthorized={() => setIsAuthorized(true)} />
        </div>

        {/* VIEW 2: APPLICATION CONTENT */}
        <div className="w-screen h-full flex-shrink-0 overflow-y-auto overflow-x-hidden">
          {!apiKeyReady ? (
            <div className="min-h-full flex flex-col items-center justify-center p-4 bg-[#FDFBF7] relative overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-[#D02020] rounded-full mix-blend-multiply opacity-80"></div>
              <div className="absolute top-20 left-24 w-20 h-20 bg-[#1040A0] mix-blend-multiply opacity-80"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F0C020] rounded-full border-4 border-black"></div>
              
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
                        <div className="px-3 py-1 md:px-4 md:py-2 border-2 border-black bg-black text-white font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold shadow-[3px_3px_0px_0px_#F0C020] md:shadow-[4px_4px_0px_0px_#F0C020]">
                            System Ready
                        </div>
                        <button 
                          onClick={handleLock}
                          className="p-1.5 md:p-2 border-2 border-black bg-white hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          title="Lock Session"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                    </div>
                </div>
              </header>

              <main className="flex-grow flex flex-col items-center px-6 py-8 w-full max-w-7xl mx-auto relative">
                <div className="absolute inset-0 pointer-events-none opacity-5 border-l border-r border-black mx-auto w-full max-w-5xl"></div>
                
                {status === AppStatus.IDLE && !previewImage && (
                  <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 animate-fade-in-up max-w-2xl z-10">
                    <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Form follows Function</h2>
                        <p className="text-neutral-500 max-w-md mx-auto uppercase text-[10px] md:text-xs font-bold tracking-widest">upload photo and select formula</p>
                    </div>
                    <ImageUploader onImageSelected={handleImageSelect} isLoading={false} />
                  </div>
                )}

                {status === AppStatus.IDLE && previewImage && (
                     <div className="w-full max-w-5xl bg-white border-4 border-black p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-8 md:gap-12 z-10 animate-fade-in relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black transform rotate-45 border-4 border-white"></div>
                        <div className="w-full lg:w-1/2 flex flex-col">
                            <div className="text-xs font-mono font-bold uppercase mb-2 border-b-2 border-black pb-1">Input Source</div>
                            <div className="relative group w-full bg-neutral-100 border-2 border-black p-4 flex-grow flex items-center justify-center min-h-[250px] md:min-h-[300px]">
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="max-h-[300px] md:max-h-[400px] w-auto object-contain shadow-md"
                                />
                                <button 
                                    onClick={handleClearPreview}
                                    className="absolute top-4 right-4 bg-white border-2 border-black text-black p-2 hover:bg-[#D02020] hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    title="Remove Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 md:mb-6 leading-none">Configuration<br/>Parameters</h3>
                                <div className="w-full space-y-2">
                                    <label className="block text-xs font-bold text-black uppercase tracking-widest">Visual Protocol</label>
                                    <div className="relative">
                                        <select
                                            value={selectedStyle.id}
                                            onChange={(e) => {
                                            const style = STYLE_PRESETS.find(s => s.id === e.target.value);
                                            if (style) setSelectedStyle(style);
                                            }}
                                            className="w-full appearance-none bg-white text-black border-4 border-black py-3 px-4 pr-10 md:py-4 md:px-6 md:pr-12 focus:outline-none focus:bg-[#FDFBF7] cursor-pointer font-bold text-sm sm:text-base md:text-lg uppercase rounded-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow overflow-hidden text-ellipsis"
                                        >
                                            {STYLE_PRESETS.map((preset) => (
                                            <option key={preset.id} value={preset.id}>{preset.label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 md:right-4 flex items-center text-black">
                                            <svg className="fill-current h-5 w-5 md:h-6 md:w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t-4 border-black border-dotted">
                                <button
                                    onClick={handleStartProcessing}
                                    className="w-full group relative flex items-center justify-center px-6 py-4 md:px-8 md:py-5 font-black text-white text-lg md:text-xl uppercase tracking-wider transition-all duration-100 bg-[#1040A0] border-4 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none"
                                >
                                    <span className="mr-3">Let's Go!</span>
                                    <div className="bg-white text-[#1040A0] rounded-full p-1 border-2 border-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                     </div>
                )}

                {status === AppStatus.PROCESSING && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-10">
                     <div className="relative w-24 h-24 md:w-32 md:h-32">
                        <div className="absolute inset-0 border-8 border-black animate-spin"></div>
                        <div className="absolute inset-0 border-8 border-t-[#D02020] border-r-[#F0C020] border-b-[#1040A0] border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                        <div className="absolute inset-[35%] bg-black"></div>
                     </div>
                     <div className="text-center space-y-4 px-6">
                        <h3 className="text-3xl md:text-4xl font-black text-black uppercase">Constructing</h3>
                        <div className="inline-block bg-[#F0C020] px-4 py-1 border-2 border-black font-mono font-bold text-xs md:text-sm">PROTOCOL: {selectedStyle.label}</div>
                     </div>
                  </div>
                )}

                {status === AppStatus.ERROR && (
                  <div className="bg-[#D02020] text-white border-4 border-black p-8 md:p-12 text-center max-w-lg mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-[#D02020] rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase mb-4">System Failure</h3>
                    <p className="font-mono text-sm mb-8 border-t-2 border-b-2 border-white/30 py-4">{errorMsg}</p>
                    <button onClick={handleReset} className="px-8 py-3 bg-white text-black font-bold uppercase border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">Re-Initialize</button>
                  </div>
                )}

                {status === AppStatus.SUCCESS && images && (
                  <div className="w-full max-w-7xl animate-fade-in flex flex-col gap-8 md:gap-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b-4 border-black pb-2">
                                <span className="font-black text-lg md:text-xl uppercase">Figure A: Source</span>
                                <div className="w-4 h-4 bg-black rounded-full"></div>
                            </div>
                            <div className="bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                                <img src={images.original} alt="Original" className="w-full h-auto object-contain max-h-[500px] md:max-h-[600px] mx-auto filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b-4 border-[#1040A0] pb-2">
                                 <span className="font-black text-lg md:text-xl uppercase text-[#1040A0]">Figure B: Output</span>
                                 <div className="flex gap-1">
                                     <div className="w-3 h-3 md:w-4 md:h-4 bg-[#D02020]"></div>
                                     <div className="w-3 h-3 md:w-4 md:h-4 bg-[#F0C020]"></div>
                                     <div className="w-3 h-3 md:w-4 md:h-4 bg-[#1040A0]"></div>
                                 </div>
                            </div>
                            <div className="bg-white p-4 border-4 border-[#1040A0] shadow-[10px_10px_0px_0px_#1040A0] md:shadow-[12px_12px_0px_0px_#1040A0]">
                                <img src={images.processed} alt="Processed" className="w-full h-auto object-contain max-h-[500px] md:max-h-[600px] mx-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center pt-8 border-t-4 border-black border-dashed">
                       <button onClick={handleDownload} className="flex items-center space-x-3 bg-[#1040A0] text-white border-4 border-black px-6 py-3 md:px-8 md:py-4 font-black text-base md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all w-full md:w-auto justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                         <span>Download Output</span>
                       </button>
                       <button onClick={handleReset} className="flex items-center space-x-3 bg-white text-black border-4 border-black px-6 py-3 md:px-8 md:py-4 font-black text-base md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all w-full md:w-auto justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         <span>Reset System</span>
                       </button>
                    </div>
                    <div className="text-center text-neutral-500 text-[10px] md:text-xs font-mono uppercase tracking-widest max-w-lg mx-auto bg-white px-4 py-2 border border-black">Status: 2K Rendering Complete.</div>
                  </div>
                )}
              </main>
              
              <footer className="w-full py-8 text-center text-black font-bold uppercase tracking-widest text-[10px] md:text-xs border-t-4 border-black bg-white">
                <p>ENGINEERED BY RON RADOM</p>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;