import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const ErrorPage = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-[#111112] border border-[#222] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#e32636]/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          {error?.status === 404 ? '404 - Not Found' : 'Unexpected Error'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {error?.status === 404 
            ? "We couldn't find the page you were looking for." 
            : (error?.statusText || error?.message || "An unexpected error occurred.")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#222] hover:bg-[#333] border border-[#333] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#e32636] hover:bg-[#f24251] shadow-[0_0_15px_rgba(227,38,54,0.3)] transition-all"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
