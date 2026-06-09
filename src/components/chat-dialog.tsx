import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { useChat, chatStore } from "@/lib/chat-store";

export function ChatDialog({
  sellerId,
  sellerName,
  contextLabel,
  onClose,
}: {
  sellerId: string;
  sellerName: string;
  contextLabel?: string;
  onClose: () => void;
}) {
  const messages = useChat(sellerId);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    chatStore.send(sellerId, value);
    setText("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-hover md:h-[600px] md:rounded-2xl">
        <header className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
          <div className="grid h-9 w-9 place-items-center rounded-full gradient-accent font-bold text-accent-foreground">
            {sellerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold">{sellerName}</div>
            <div className="text-[11px] text-primary-foreground/70">
              {contextLabel ? `Re: ${contextLabel}` : "Online"}
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2">Start a private conversation with {sellerName}.</p>
                <p className="text-xs">Ask about price, condition, or pickup details.</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  m.from === "me"
                    ? "gradient-accent text-accent-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}
              >
                {m.text}
                <div className={`mt-0.5 text-[10px] ${m.from === "me" ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border bg-card p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="h-11 flex-1 rounded-full border border-border bg-secondary px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button type="submit" className="grid h-11 w-11 place-items-center rounded-full gradient-accent text-accent-foreground shadow-card hover:shadow-glow">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
