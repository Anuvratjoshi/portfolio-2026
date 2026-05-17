export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  timestamp: number;
  reaction?: "up" | "down";
  error?: boolean;
  failedInput?: string;
  bookmarked?: boolean;
}

export type View = "chat" | "enquiry";
