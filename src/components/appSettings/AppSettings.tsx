import { forwardRef, useState } from "react";
import Profile from "./Profile";
import Settings from "./Settings";
import ResetPassword from "./ResetPassword";

interface IProps {}

const AppSettings = forwardRef<HTMLDialogElement, IProps>((_props, ref) => {
  const [selectedSetting, setSelectedSetting] = useState<
    "appSetting" | "profile" | "resetPassword"
  >("appSetting");

  const handleSelectSetting = (
    setting: "appSetting" | "profile" | "resetPassword"
  ) => {
    setSelectedSetting(setting);
  };

  return (
    <dialog ref={ref} className="outline-none rounded-lg h-full md:h-auto">
      <div className="dialog-container pt-4 h-full">
        <h2 className="text-center mb-6 text-2xl font-semibold">Settings</h2>
        <div className="flex h-full">
          <div className="border-r px-2">
            <h4
              className={`py-2 px-4 cursor-pointer rounded hover:bg-slate-200 hover:text-black ${
                selectedSetting === "appSetting" && "bg-blue-500 text-white"
              }`}
              onClick={() => handleSelectSetting("appSetting")}
            >
              app setting
            </h4>
            <hr />
            <h4
              className={`py-2 px-4 cursor-pointer rounded hover:bg-slate-200 hover:text-black ${
                selectedSetting === "profile" && "bg-blue-500 text-white"
              }`}
              onClick={() => handleSelectSetting("profile")}
            >
              profile
            </h4>
            <hr />
            <h4
              className={`py-2 px-4 cursor-pointer rounded hover:bg-slate-200 hover:text-black ${
                selectedSetting === "resetPassword" && "bg-blue-500 text-white"
              }`}
              onClick={() => handleSelectSetting("resetPassword")}
            >
              reset password
            </h4>
          </div>
          <div className="w-[400px] h-[400px] px-4">
            {selectedSetting === "appSetting" && <Settings />}
            {selectedSetting === "profile" && <Profile />}
            {selectedSetting === "resetPassword" && <ResetPassword />}
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default AppSettings;
