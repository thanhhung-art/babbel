import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import Avatar from "../Avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateProfileQuery,
  verifyUser,
} from "../../lib/react_query/queries/user/user";
import { user } from "../../utils/contants";
import { IFileUpload } from "../../types/file";
import { handleProfileImageUploads } from "../../utils/file";

const Profile = () => {
  const { data } = useQuery({ queryKey: [user], queryFn: verifyUser });
  const name = useMemo(() => data?.name || "", [data]);
  const email = useMemo(() => data?.email || "", [data]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileUploadRef = useRef<IFileUpload>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const queryclient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: ({
      email,
      name,
      avatar,
    }: {
      email: string;
      name: string;
      avatar: string;
    }) => {
      return updateProfileQuery({
        email,
        name,
        avatar,
      });
    },
    onSuccess() {
      queryclient.invalidateQueries({ queryKey: [user] });
    },
  });

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = crypto.randomUUID() + "." + file.type.split("/")[1];
      const totalChunks = Math.ceil(file.size / (64 * 1024));

      for (let j = 0; j < file.size; j += 64 * 1024) {
        const chunk = file.slice(j, j + 64 * 1024);
        if (!fileUploadRef.current[fileName]) {
          fileUploadRef.current[fileName] = {
            chunks: [chunk],
            size: file.size,
            name: fileName,
            type: file.type,
            totalChunks,
          };
        } else {
          fileUploadRef.current[fileName].chunks.push(chunk);
        }
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let url: string[] = [];

    if (emailRef.current && nameRef.current) {
      // if there are files to upload
      if (Object.keys(fileUploadRef.current).length > 0) {
        const res = await handleProfileImageUploads(fileUploadRef.current);
        url = res.flat().map((r) => r.url);
      }

      if (
        emailRef.current.value !== email ||
        nameRef.current.value !== name ||
        (url[0] && data?.avatar !== url[0])
      ) {
        console.log(url[0]);
        updateProfileMutation.mutate({
          email: emailRef.current.value,
          name: nameRef.current.value,
          avatar: url[0] || "",
        });
      }
    }

    fileUploadRef.current = {};
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex justify-center">
        <label htmlFor="choose-file" className="cursor-pointer">
          <Avatar
            width="w-[100px]"
            height="h-[100px]"
            name={name}
            avatar={imagePreview || data?.avatar || ""}
          />
          <input
            id="choose-file"
            type="file"
            accept="image/*"
            className="hidden"
            title="Choose profile picture"
            onChange={handleSelectFile}
          />
        </label>
      </div>

      <div className="mt-8 flex-1">
        <div className="mb-4">
          <label htmlFor="user-email" className="font-semibold">
            Email:
          </label>
          <input
            id="user-email"
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded outline-none"
            defaultValue={email}
            ref={emailRef}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="user-name" className="font-semibold">
            Name:
          </label>
          <input
            id="user-name"
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded outline-none"
            defaultValue={name}
            ref={nameRef}
          />
        </div>
      </div>

      <div className="pb-4">
        <button className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 active:bg-blue-700">
          update
        </button>
      </div>
    </form>
  );
};

export default Profile;
