export interface IFile {
  data: ArrayBuffer;
  name: string;
  type: string;
  size: number;
}

export interface IFileUpload {
  [key: string]: {
    chunks: Blob[];
    size: number;
    name: string;
    type: string;
    totalChunks: number;
  };
}
