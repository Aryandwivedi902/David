"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="glass-card border border-rose-500/20 bg-rose-500/5 p-6 text-center space-y-4 max-w-md mx-auto">
      <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
      <h4 className="text-sm font-bold tracking-widest text-white uppercase font-sans">
        Operation Fault
      </h4>
      <p className="text-gray-400 text-xs font-sans leading-relaxed">
        {message || "A network or validation error occurred. Please verify options and retry."}
      </p>
    </div>
  );
}
