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
    <div className="pt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please enter your current password and choose a new one
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        {/* Current Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="current-password" 
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="current-password"
              className={`w-full px-4 py-2 text-gray-700 border rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 ${
                          errors.currentPassword 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300'
                        }`}
              ref={currentPassword}
              onFocus={resetErrors}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword}
              </p>
            )}
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="new-password" 
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="new-password"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       transition-all duration-200"
              ref={newPassword}
              onFocus={resetErrors}
              placeholder="Choose a new password"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="confirm-password" 
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirm-password"
              className={`w-full px-4 py-2 text-gray-700 border rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 ${
                          errors.confirmPassword 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300'
                        }`}
              ref={confirmPassword}
              onFocus={resetErrors}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-500 
                   rounded-lg hover:bg-blue-600 active:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-colors duration-200 flex items-center justify-center"
        >
          {resetPasswordMutation.isPending ? (
            <div className="flex items-center gap-2">
              <LoadingIcon width={16} height={16} className="animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
