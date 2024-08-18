export interface IMessage {
  id: string;
  userId: string;
  content: string;
  createdAt?: Date;
  udpateAt?: Date;
  conversationId?: string;
  roomId?: string;
  user?: { name: string };
  attachments?: MessageAttachment[];
}

interface MessageAttachment {
  id: string;
  messageId: string;
  url: string;
  type: string;
  createdAt: Date;
  udpateAt: Date;
}

export interface IFileChunkPayload {
  name: string;
  chunkIndex: number;
  totalChunks: number;
  chunk: ArrayBuffer;
}
