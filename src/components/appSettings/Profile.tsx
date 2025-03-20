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
    <div className="h-full flex flex-col pt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col max-w-md mx-auto w-full"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <label
            htmlFor="choose-file"
            className="group relative cursor-pointer"
            title="Change profile picture"
          >
            <Avatar
              width="w-32"
              height="h-32"
              name={name}
              avatar={imagePreview || data?.avatar || ""}
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                Change Photo
              </span>
            </div>
            <input
              id="choose-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectFile}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="user-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       placeholder:text-gray-400 transition-all duration-200"
              defaultValue={email}
              ref={emailRef}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="user-name"
              className="block text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <input
              id="user-name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       placeholder:text-gray-400 transition-all duration-200"
              defaultValue={name}
              ref={nameRef}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 
                     rounded-lg hover:bg-blue-600 active:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 flex items-center justify-center"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
