import { socket } from "../SocketContext/socket";
import { IFile } from "../types/file";

export const splitArrayBufferIntoChunks = (
  buffer: ArrayBuffer,
  chunkSize: number
): ArrayBuffer[] => {
  const chunks = [];
  for (let i = 0; i < buffer.byteLength; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }
  return chunks;
};

export const sendFileToServer = (
  filesBuffer: IFile[],
  messageAttachmentId: string
): void => {
  const CHUNK_SIZE = 64 * 1024; // 64kb

  filesBuffer.forEach((file) => {
    const chunks = splitArrayBufferIntoChunks(file.data, CHUNK_SIZE);
    chunks.forEach((chunk, index) => {
      socket.emit("send-chunk-to-server", {
        messageAttachmentId,
        filePayload: {
          chunk,
          index,
          totalChunks: chunks.length,
          fileName: crypto.randomUUID(),
          type: file.type,
          size: file.size,
        },
      });
    });
  });
};
