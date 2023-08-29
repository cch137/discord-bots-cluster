interface DCMessage {
  uid: string;
  user: string;
  content: string;
  createdAt: number;
}

interface OpenAIMessage {
  role: string;
  content: string;
}

export {
  DCMessage,
  OpenAIMessage,
}
