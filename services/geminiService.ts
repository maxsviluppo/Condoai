
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async processVoiceCommand(transcript: string, context: any): Promise<any> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, enum: ['COMMAND', 'QUERY', 'DICTATION'] },
            actionType: { type: Type.STRING, enum: ['CREATE_MAINTENANCE', 'CHECK_PAGAMENTI', 'SEND_MESSAGE', 'GENERATE_MINUTES', 'INFO_REQUEST'] },
            params: { type: Type.OBJECT },
            speechResponse: { type: Type.STRING }
          },
          required: ['intent', 'speechResponse']
        }
      },
      contents: `Analizza questo comando condominiale: "${transcript}". Contesto: ${JSON.stringify(context)}. Rispondi in italiano.`
    });
    return JSON.parse(response.text || '{}');
  },

  async classifyAndSummarizeMessages(messages: any[]): Promise<any> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Urgente', 'Informativo', 'Social', 'Inutile'] },
              summary: { type: Type.STRING }
            }
          }
        }
      },
      contents: `Classifica questi messaggi condominiali e fornisci un mini-riassunto per ciascuno: ${JSON.stringify(messages)}`
    });
    return JSON.parse(response.text || '[]');
  },

  // Added analyzeFinancials for Dashboard component
  async analyzeFinancials(data: any): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analizza questi dati finanziari del condominio e fornisci un breve insight strategico: ${JSON.stringify(data)}`,
    });
    return response.text || "Dati non disponibili.";
  },

  async analyzeRisksAndPrevention(data: any): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Agisci come analista preventivo per condomini. Analizza questi dati (costi, guasti, reclami) e identifica 3 pattern di rischio o opportunità di risparmio: ${JSON.stringify(data)}`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Nessuna anomalia rilevata.";
  },

  async legalConsultant(query: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Sei un consulente legale esperto in diritto condominiale italiano. Rispondi in modo chiaro a questa domanda: "${query}"`,
      config: { thinkingConfig: { thinkingBudget: 8000 } }
    });
    return response.text || "Consultare un legale per pareri ufficiali.";
  },

  async analyzeDocument(docName: string, contentPlaceholder: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analizza "${docName}": estrai regole, divieti e scadenze.`,
    });
    return response.text || "Analisi non riuscita.";
  },

  async suggestEmergencyAction(emergencyType: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Checklist rapida per emergenza: ${emergencyType}.`,
    });
    return response.text || "Contattare i soccorsi.";
  },

  // Added generateAssemblyMinutes for Assemblies component
  async generateAssemblyMinutes(transcript: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un verbale formale basato su questa trascrizione di assemblea condominiale: "${transcript}"`,
    });
    return response.text || "Impossibile generare il verbale.";
  },

  async speak(text: string): Promise<Uint8Array | undefined> {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64 ? this.decodeBase64(base64) : undefined;
  },

  decodeBase64(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  },

  async decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  }
};
