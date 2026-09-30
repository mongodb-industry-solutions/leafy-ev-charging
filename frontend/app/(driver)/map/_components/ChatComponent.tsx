"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useUserContext } from "@/contexts/UserContext";
import {
  AgentAudience,
  ChatRole,
  SendChatMessageDocument
} from "@/graphql/generated/graphql";


type Message = {
  role: "user" | "assistant";
  content: string;
};


export default function ChatComponent() {
  const { selectedUser } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sendChatMessage] = useMutation(SendChatMessageDocument);


  async function send(content?: string) {
    content = content ?? draft.trim();

    if (!content || pending || !selectedUser) return;


    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setPending(true);
    setError("");

    try {
      const { data } = await sendChatMessage({
        variables: {
          audience: AgentAudience.Operator,
          userId: selectedUser.id,
          messages: next.map((message) => ({
            role: message.role === "user" ? ChatRole.User : ChatRole.Assistant,
            content: message.content
          }))
        }
      });

      const reply = data?.sendChatMessage.reply;
      if (!reply) throw new Error("Empty chat response");

      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages(messages);
      setDraft(content);
      setError("Message could not be sent. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 pb-3">
        <span className="material-symbols-outlined text-slate-600">smart_toy</span>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Leafy Charge Assistant</h2>
          <p className="text-xs text-slate-500">Ask a question or pick a suggestion below</p>
        </div>
      </header>
      <div role="log" aria-live="polite" className="min-h-0 flex-1 overflow-y-auto">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-xl border px-3 py-2 text-sm ${isUser
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
              >
                <strong className="mb-1 block text-xs">
                  {isUser ? "You" : "Assistant"}
                </strong>
                {message.content}
              </p>
            </div>
          );
        })}
        {pending && (
          <p role="status" className="text-sm italic text-slate-500">
            Thinking...
          </p>
        )}
      </div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void send("First question")}
          className="h-10 w-56 px-4 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-md hover:bg-gray-50 active:scale-95 transition"
        >
          First question
        </button>
        <button
          type="button"
          onClick={() => void send("Second question")}
          className="h-10 w-56 px-4 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-md hover:bg-gray-50 active:scale-95 transition"
        >
          Second question
        </button>
      </div>
      <hr />
      <form onSubmit={(event) => { event.preventDefault(); void send(); }}
        className="flex gap-2">

        <input aria-label="Message" value={draft} disabled={pending}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded border p-2 text-sm" />
        <button disabled={pending || !draft.trim() || !selectedUser}
          aria-label="Send message" title="Send message"
          className="flex h-10 w-15 shrink-0 items-center justify-center rounded border disabled:opacity-40">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}