import { socket } from "../SocketContext/socket";
import { IFileChunkPayload } from "../types/message";

export const sendFile = (fileName: string, arrayBuffer: ArrayBuffer): void => {
  const chunkSize = 64 * 1024; // 64kb
  const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
  const unit8Array = new Uint8Array(arrayBuffer);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, unit8Array.length);
    const chunk = unit8Array.slice(start, end);

    const payload: IFileChunkPayload = {
      name: fileName,
      chunkIndex,
      totalChunks,
      chunk: chunk.buffer,
    };

    socket.emit("file-chunk", payload);
  }
};
