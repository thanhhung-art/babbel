import { IFileUpload } from "../types/file";

const apiUrl = import.meta.env.VITE_API_URL;

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const sendChunk = async (
  chunk: Blob,
  fileName: string,
  chunkIndex: number,
  totalChunks: number,
  type: string,
  size: number
): Promise<{ fileData: string; status: string }> => {
  try {
    const data = new FormData();
    data.append("file", chunk);
    data.append("fileName", fileName);
    data.append("chunkIndex", chunkIndex.toString());
    data.append("totalChunks", totalChunks.toString());
    data.append("type", type);
    data.append("size", size.toString());

    const response = await fetch(apiUrl + "/file/upload", {
      method: "POST",
      headers: {
        "X-File-Name": fileName,
        "X-Chunk-Index": chunkIndex.toString(),
        "X-Total-Chunks": totalChunks.toString(),
        "x-file-type": type,
        "x-file-size": size.toString(),
      },
      credentials: "include",
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to upload chunk");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error uploading chunk ${chunkIndex} of ${fileName}:`, error);
    throw error;
  }
};

export const handleFileUploads = async (files: IFileUpload) => {
  const fileUploadsPromises = Object.keys(files).map((key) => {
    const fileData = files[key];

    return Promise.all(
      fileData.chunks.map((chunk, index) =>
        sendChunk(
          chunk,
          fileData.name,
          index,
          fileData.totalChunks,
          fileData.type,
          fileData.size
        )
      )
    );
  });

  return Promise.all(fileUploadsPromises);
};

// send image profile to server

export const sendProfileImageChunk = async (
  chunk: Blob,
  fileName: string,
  chunkIndex: number,
  totalChunks: number,
  type: string,
  size: number
): Promise<{ url: string; status: string }> => {
  try {
    const data = new FormData();
    data.append("file", chunk);
    data.append("fileName", fileName);
    data.append("chunkIndex", chunkIndex.toString());
    data.append("totalChunks", totalChunks.toString());
    data.append("type", type);
    data.append("size", size.toString());

    const response = await fetch(apiUrl + "/file/upload-profile-image", {
      method: "POST",
      headers: {
        "X-File-Name": fileName,
        "X-Chunk-Index": chunkIndex.toString(),
        "X-Total-Chunks": totalChunks.toString(),
        "x-file-type": type,
        "x-file-size": size.toString(),
      },
      credentials: "include",
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to upload chunk");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error uploading chunk ${chunkIndex} of ${fileName}:`, error);
    throw error;
  }
};

export const handleProfileImageUploads = async (file: IFileUpload) => {
  const fileUploadsPromises = Object.keys(file).map((key) => {
    const fileData = file[key];

    return Promise.all(
      fileData.chunks.map((chunk, index) =>
        sendProfileImageChunk(
          chunk,
          fileData.name,
          index,
          fileData.totalChunks,
          fileData.type,
          fileData.size
        )
      )
    );
  });

  return Promise.all(fileUploadsPromises);
};
