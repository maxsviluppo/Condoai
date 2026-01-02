
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2, Play } from 'lucide-react';

interface VoiceCommandProps {
  onResult: (text: string) => void;
  placeholder?: string;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({ onResult, placeholder = "Ditta o dai un comando..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser non supporta il riconoscimento vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setInterimText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interimText) {
        onResult(interimText);
        setInterimText('');
      }
    };

    recognition.start();
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
      <button
        onClick={isListening ? undefined : startListening}
        className={`p-3 rounded-full transition-all ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
        }`}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
      <div className="flex-1">
        {isListening ? (
          <p className="text-sm italic text-slate-500">Ascolto... {interimText}</p>
        ) : (
          <p className="text-sm text-slate-400">{placeholder}</p>
        )}
      </div>
      {isListening && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
    </div>
  );
};

export default VoiceCommand;
