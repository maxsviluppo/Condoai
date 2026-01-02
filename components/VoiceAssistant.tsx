
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2, X, Sparkles, MessageSquare, Waves } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AIAction } from '../types';

interface VoiceAssistantProps {
  onActionExecute: (action: AIAction) => void;
  context: any;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onActionExecute, context }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const toggleAssistant = () => setShowPanel(!showPanel);

  const handleSpeak = async (text: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    setIsSpeaking(true);
    try {
      const audioData = await geminiService.speak(text);
      if (audioData) {
        const buffer = await geminiService.decodeAudioData(audioData, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (e) {
      console.error("TTS Error", e);
      setIsSpeaking(false);
    }
  };

  const startRecognition = () => {
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
      setTranscript('');
      setAiMessage(null);
    };

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setTranscript(current);
    };

    recognition.onend = async () => {
      setIsListening(false);
      // Only process if we have a significant transcript
      if (transcript.trim().length > 2) {
        processCommand(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = async (text: string) => {
    setIsProcessing(true);
    try {
      const aiResult = await geminiService.processVoiceCommand(text, context);
      setAiMessage(aiResult.speechResponse);
      
      // Notify parent to actually perform the action in the state
      onActionExecute(aiResult);
      
      // Talk back to user
      await handleSpeak(aiResult.speechResponse);
    } catch (e) {
      setAiMessage("Scusa, ho avuto un problema nel processare il comando.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {showPanel && (
        <div className="w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white uppercase tracking-widest block">CondoAI Assistant</span>
                <span className="text-[10px] text-emerald-400 font-medium">Sempre in ascolto</span>
              </div>
            </div>
            <button onClick={toggleAssistant} className="p-1 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 h-80 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
            {aiMessage ? (
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Risposta AI</p>
                <p className="text-slate-200 text-sm italic">"{aiMessage}"</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <MessageSquare className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm px-8">Prova a dire: "Registra guasto ascensore" o "Chi deve ancora pagare?"</p>
              </div>
            )}

            {transcript && (
              <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 ml-8">
                <p className="text-emerald-500 text-[10px] font-bold uppercase mb-1">Tu</p>
                <p className="text-slate-300 text-sm">"{transcript}"</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium animate-pulse ml-auto">
                <Loader2 className="w-3 h-3 animate-spin" /> Pensando...
              </div>
            )}
            
            {isSpeaking && (
              <div className="flex items-center gap-2 text-blue-400 text-xs font-medium ml-auto">
                <Volume2 className="w-3 h-3 animate-pulse" /> Parlante...
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-center items-center">
            <button
              onClick={isListening ? undefined : startRecognition}
              className={`relative group flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 ${
                isListening 
                ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                : 'bg-emerald-500 hover:scale-110 shadow-lg'
              }`}
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></div>
              )}
              {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!showPanel && (
        <button 
          onClick={toggleAssistant}
          className="w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 transition-transform group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 z-10 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-400 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default VoiceAssistant;
