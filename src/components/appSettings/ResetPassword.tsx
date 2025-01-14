import { useMutation } from "@tanstack/react-query";
import { createRef, FormEvent, useState } from "react";
import { resetPassword } from "../../lib/react_query/queries/user/user";
import LoadingIcon from "../../assets/icons/LoadingIcon";

const ResetPassword = () => {
  const currentPassword = createRef<HTMLInputElement>();
  const newPassword = createRef<HTMLInputElement>();
  const confirmPassword = createRef<HTMLInputElement>();
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      return resetPassword(oldPassword, newPassword);
    },
    onError: (error: { status: number; message: string }) => {
      if (error.message === "Old password is incorrect") {
        setErrors({
          ...errors,
          currentPassword: "Old password is incorrect",
        });
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.current?.value !== confirmPassword.current?.value) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    if (currentPassword.current?.value && newPassword.current?.value) {
      resetPasswordMutation.mutate({
        oldPassword: currentPassword.current.value,
        newPassword: newPassword.current.value,
      });
    }

    currentPassword.current!.value = "";
    newPassword.current!.value = "";
    confirmPassword.current!.value = "";
  };

  const resetErrors = () => {
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-center font-semibold">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="current-password" className="text-sm font-semibold">
            Current Password:
          </label>
          <div>
            <input
              type="password"
              id="current-password"
              className="border w-full outline-none rounded p-2"
              ref={currentPassword}
              onFocus={resetErrors}
            />
          </div>
          {errors.currentPassword && (
            <span className="text-[13px] text-red-600">
              {errors.currentPassword}
            </span>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="new-password" className="text-sm font-semibold">
            New Password:
          </label>
          <div>
            <input
              type="password"
              id="new-password"
              className="border w-full outline-none rounded p-2"
              ref={newPassword}
              onFocus={resetErrors}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="confirm-password" className="text-sm font-semibold">
            Confirm Password:
          </label>
          <div>
            <input
              type="password"
              id="confirm-password"
              className="border w-full outline-none rounded p-2"
              ref={confirmPassword}
              onFocus={resetErrors}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-[13px] text-red-600">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="mt-8">
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700"
            type="submit"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <div className="flex gap-2 justify-center items-center">
                Resetting{" "}
                <LoadingIcon width={20} height={20} className="animate-spin" />
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
