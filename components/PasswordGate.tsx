import React, { useState } from 'react';

interface PasswordGateProps {
  onAuthorized: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onAuthorized }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'photo') {
      onAuthorized();
    } else {
      setError(true);
      setPassword('');
      // Shake animation or visual feedback
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFBF7] relative overflow-hidden">
      {/* Bauhaus Decorative Elements */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#1040A0] rounded-full opacity-10"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-[#D02020] transform rotate-12 opacity-10"></div>
      <div className="absolute top-1/2 left-10 w-20 h-20 border-4 border-black transform -translate-y-1/2 rotate-45 opacity-5"></div>

      <div className={`w-full max-w-md bg-white border-8 border-black p-8 md:p-10 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] relative z-10 transition-transform duration-150 ${error ? 'translate-x-2' : ''}`}>
        
        {/* Top Header Label */}
        <div className="absolute top-0 left-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] -translate-y-full">
          Secure Access Point
        </div>

        <div className="mb-10 text-center">
            {/* The "Exact Logo" from the main header */}
            <div className="flex items-center justify-center gap-3 mb-8 border-b-2 border-black pb-6">
                <div className="flex gap-1">
                    <div className="w-5 h-5 bg-[#D02020] border-2 border-black"></div>
                    <div className="w-5 h-5 bg-[#1040A0] border-2 border-black rounded-full"></div>
                    <div className="w-5 h-5 bg-[#F0C020] border-2 border-black transform rotate-45"></div>
                </div>
                <h2 className="text-2xl font-black text-black tracking-tighter uppercase whitespace-nowrap">
                    Visible<span className="text-neutral-400">Genius</span>
                </h2>
            </div>

            <h1 className="text-4xl font-black text-black uppercase tracking-tighter leading-none mb-2">
                Restricted<br/><span className="text-[#D02020]">Access</span>
            </h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-4">Authorization Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PROTOCOL KEY"
              autoFocus
              className={`w-full bg-[#FDFBF7] border-4 border-black px-4 md:px-6 py-4 text-center font-black text-lg md:text-xl uppercase placeholder:text-neutral-300 focus:outline-none focus:bg-white transition-colors ${error ? 'border-[#D02020] text-[#D02020]' : 'border-black text-black'}`}
            />
            {error && (
              <div className="absolute -bottom-6 left-0 w-full text-center">
                <span className="text-[10px] font-black text-[#D02020] uppercase tracking-widest">Invalid Credentials</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-black py-4 uppercase tracking-[0.2em] border-4 border-black hover:bg-[#1040A0] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            Authorize
          </button>
        </form>

        <div className="mt-12 pt-6 border-t-2 border-black border-dotted flex justify-between items-center opacity-40">
           <span className="text-[8px] font-bold uppercase tracking-widest">v0.3</span>
           <span className="text-[8px] font-bold uppercase tracking-widest">BY RON RADOM</span>
        </div>
      </div>
    </div>
  );
};
