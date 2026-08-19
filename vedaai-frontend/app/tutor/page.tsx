"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { API_URL } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTranscript, isThinking]);

  // Speak text using Edge Neural TTS backend
  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setIsSpeaking(true);
      const response = await fetch(`${API_URL}/api/tutor/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.3;
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => setIsSpeaking(false);

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  // Send message to tutor API with SSE streaming
  const sendToTutor = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const newUserMsg: Message = { role: "user", content: userMessage.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsThinking(true);
    setCurrentTranscript("");

    try {
      const response = await fetch(`${API_URL}/api/tutor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let firstSentenceSpoken = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.token) {
                fullText += data.token;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return [...prev.slice(0, -1), { role: "assistant", content: fullText }];
                  }
                  return [...prev, { role: "assistant", content: fullText }];
                });

                if (!firstSentenceSpoken && /[.!?]\s/.test(fullText)) {
                  firstSentenceSpoken = true;
                  setIsThinking(false);
                }
              }
              if (data.done) {
                setIsThinking(false);
                speak(data.fullResponse || fullText);
              }
              if (data.error) {
                setIsThinking(false);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("Tutor API error:", error);
      setIsThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!" }]);
    }
  }, [messages, speak]);

  // Speech recognition
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition. Please use Chrome.");
      return;
    }

    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsSpeaking(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setCurrentTranscript(interim || final);
      if (final) {
        setCurrentTranscript("");
        sendToTutor(final);
        recognition.stop();
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setCurrentTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [sendToTutor]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (currentTranscript) {
      sendToTutor(currentTranscript);
      setCurrentTranscript("");
    }
  }, [currentTranscript, sendToTutor]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendToTutor(textInput);
      setTextInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--qm-bg))" }}>
      {/* Header */}
      <div className="backdrop-blur-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{
          background: "hsl(var(--qm-surface) / 0.9)",
          borderBottom: "1px solid hsl(var(--qm-border))",
        }}
      >
        <Link href="/assignments" className="flex items-center gap-2 transition-colors"
          style={{ color: "hsl(var(--qm-text-muted))" }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden sm:inline text-[14px]">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.02L12 17L7.09 20.02L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
              fill="hsl(var(--qm-accent))" fillOpacity="0.8" />
          </svg>
          <h1 className="text-[16px] font-bold" style={{ color: "hsl(var(--qm-text))" }}>AI Tutor</h1>
        </div>
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled && audioRef.current) { audioRef.current.pause(); audioRef.current = null; setIsSpeaking(false); }
          }}
          className="p-2 rounded-full transition-colors"
          style={{
            background: voiceEnabled ? "hsl(var(--qm-accent-subtle))" : "hsl(var(--qm-bg-subtle))",
            color: voiceEnabled ? "hsl(var(--qm-accent))" : "hsl(var(--qm-text-muted))",
          }}
          aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
        >
          {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {messages.length === 0 && !isListening && (
          <div className="text-center mt-16 qm-slide-up">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
                boxShadow: "0 8px 24px hsla(245, 58%, 51%, 0.25)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.02L12 17L7.09 20.02L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
                  fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <h2 className="text-[22px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
              Hi! I&apos;m your AI Tutor 👋
            </h2>
            <p className="max-w-sm mx-auto mb-8 text-[14px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
              Click the microphone and start speaking in English. I&apos;ll help you practice and improve!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Tell me about yourself", "Help me with grammar", "Let's practice vocabulary", "Can we have a conversation?"].map((s) => (
                <button
                  key={s}
                  onClick={() => sendToTutor(s)}
                  className="qm-btn qm-btn-secondary text-[12px] px-4 py-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 text-[14px] leading-relaxed ${
                msg.role === "user"
                  ? "rounded-2xl rounded-br-md text-white"
                  : "rounded-2xl rounded-bl-md"
              }`}
              style={
                msg.role === "user"
                  ? { background: "hsl(var(--qm-accent))" }
                  : {
                      background: "hsl(var(--qm-surface))",
                      color: "hsl(var(--qm-text))",
                      border: "1px solid hsl(var(--qm-border))",
                      boxShadow: "var(--qm-shadow-sm)",
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isThinking && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start mb-4">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md"
              style={{
                background: "hsl(var(--qm-surface))",
                border: "1px solid hsl(var(--qm-border))",
                boxShadow: "var(--qm-shadow-sm)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "hsl(var(--qm-accent))", animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "hsl(var(--qm-accent))", animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "hsl(var(--qm-accent))", animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {currentTranscript && (
          <div className="flex justify-end mb-4">
            <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md text-[14px] italic"
              style={{
                background: "hsl(var(--qm-accent-subtle))",
                color: "hsl(var(--qm-accent))",
                border: "1px solid hsl(var(--qm-accent) / 0.2)",
              }}
            >
              {currentTranscript}...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 backdrop-blur-lg px-4 py-4"
        style={{
          background: "hsl(var(--qm-surface) / 0.9)",
          borderTop: "1px solid hsl(var(--qm-border))",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              className="qm-input rounded-xl py-3 text-[13px]"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="qm-btn p-3 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "hsl(var(--qm-accent))", borderRadius: "var(--qm-radius)" }}
            >
              <Send size={18} />
            </button>
          </form>

          {/* Mic Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isThinking}
            className={`relative p-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening ? "scale-110" : "hover:scale-105"
            }`}
            style={{
              background: isListening
                ? "hsl(var(--qm-error))"
                : "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
              color: "white",
              boxShadow: isListening
                ? "0 4px 16px hsla(0, 72%, 51%, 0.3)"
                : "0 4px 16px hsla(245, 58%, 51%, 0.3)",
            }}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "hsl(var(--qm-error))" }} />
                <span className="absolute -inset-1 rounded-full border-2 animate-pulse" style={{ borderColor: "hsl(var(--qm-error) / 0.4)" }} />
              </>
            )}
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-full border-2 animate-pulse" style={{ borderColor: "hsl(var(--qm-accent) / 0.4)" }} />
            )}
          </button>
        </div>

        <div className="text-center mt-2">
          <p className="text-[11px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>
            {isListening ? "🎙️ Listening... Speak now!" : isSpeaking ? "🔊 Tutor is speaking..." : isThinking ? "💭 Thinking..." : "Tap the mic or type to start"}
          </p>
        </div>
      </div>
    </div>
  );
}
