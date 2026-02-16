
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Base64 decoding for PCM data
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const FEEDBACK_PHRASES: Record<string, string[]> = {
  pt: ["Muito bem!", "Incrível!", "Você conseguiu!", "Excelente!"],
  en: ["Great job!", "Amazing!", "You did it!", "Excellent!"],
  es: ["¡Excelente!", "¡Muy bien!", "¡Lo lograste!", "¡Fantástico!"],
  fr: ["C'est super!", "Très bien!", "Bravo!", "Magnifique!"],
  it: ["Eccellente!", "Bravo!", "Ottimo lavoro!", "Fantastico!"],
  zh: ["太棒了！", "做得好！", "你成功了！", "真厉害！"]
};

const playAudioBuffer = (buffer: AudioBuffer, playbackRate: number = 1.0) => {
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const source = outputAudioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  source.connect(outputAudioContext.destination);
  source.start();
};

export const playUISound = (type: 'success' | 'click' | 'pop', enabled: boolean = true) => {
  if (!enabled) return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'pop') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
};


const AUDIO_CACHE = new Map<string, AudioBuffer>();

export const prefetchAudio = async (text: string, lang: string) => {
  const cacheKey = `${text}-${lang}`;
  if (AUDIO_CACHE.has(cacheKey)) return;

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const instruction = `
      Task: Speak for an autistic child.
      Tone: Calm, clear, steady.
      Word in ${lang}: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: instruction }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
      AUDIO_CACHE.set(cacheKey, audioBuffer);
    }
  } catch (error) {
    console.error("Prefetch Error:", error);
  }
};

export const speakWord = async (text: string, lang: string, playbackRate: number = 1.0, instructionOverride?: string) => {
  const cacheKey = `${text}-${lang}`;

  try {
    if (AUDIO_CACHE.has(cacheKey)) {
      const buffer = AUDIO_CACHE.get(cacheKey)!;
      playAudioBuffer(buffer, playbackRate);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    // Base instruction for Autism-friendly TTS
    const baseInstruction = instructionOverride || `
      Task: Speak the following word/phrase for an autistic child (age 6-13).
      Tone: Calm, clear, steady, and friendly.
      Rules:
      1. Articulate every syllable distinctly.
      2. Keep a steady pace. Do NOT speak too fast.
      3. Avoid sudden loudness or aggressive intonation.
      4. Be encouraging but not overstimulating.
      
      Word/Phrase to speak in ${lang}: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: baseInstruction }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
      AUDIO_CACHE.set(cacheKey, audioBuffer);
      playAudioBuffer(audioBuffer, playbackRate);
    }
  } catch (error) {
    console.error("TTS Error:", error);
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    msg.rate = playbackRate * 0.8;
    window.speechSynthesis.speak(msg);
  }
};

export const speakMascot = async (text: string, lang: string, mascotName: string) => {
  const instruction = `
    Roleplay: You are ${mascotName}, a supportive companion for an autistic child.
    Voice Personality: Very calm, patient, warm, and hyper-articulate.
    Target Audience: Autistic children (6-13 years).
    
    Instructions:
    1. Speak slowly and clearly.
    2. Use a soothing, reassuring tone.
    3. No loud surprises.
    4. If ${mascotName} is an animal, DO NOT make animal noises, just speak in a human voice with that character's vibe (e.g. Owl = wise/slow).
    
    Say this in ${lang}: "${text}"
  `;

  return speakWord(text, lang, 0.9, instruction);
};

export const speakGuided = async (text: string, lang: string) => {
  // Guided mode is dynamic and complex, usually valid to generate fresh or use separate cache keys if needed.
  // For simplicity, we won't cache guided sequence yet or use unique keys.
  const instruction = `Speak the word "${text}" in ${lang} twice. 
  First time: Speak very slowly, syllable by syllable, clearly.
  Then pause for 2 seconds.
  Second time: Speak at a normal, friendly, and encouraging speed.`;

  return speakWord(text, lang, 1.0, instruction);
};

export const speakFeedback = async (lang: string) => {
  const phrases = FEEDBACK_PHRASES[lang] || FEEDBACK_PHRASES['en'];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  // We can cache feedback phrases too if we want
  return speakWord(phrase, lang, 1.0, `Say this positive feedback phrase in a happy and encouraging voice: ${phrase}`);
};
