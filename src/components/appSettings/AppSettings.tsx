import { useState } from "react";
import Profile from "./Profile";
import Settings from "./Settings";
import ResetPassword from "./ResetPassword";
import ResetPasswordIcon from "../../assets/icons/ResetPassword";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import SettingIcon from "../../assets/icons/SettingIcon";
import XIcon from "../../assets/icons/XIcon";
import useAppStore from "../../lib/zustand/store";

const AppSettings = () => {
  const [selectedSetting, setSelectedSetting] = useState<
    "appSetting" | "profile" | "resetPassword"
  >("appSetting");

  const handleCloseAppSetting = useAppStore((state) => state.closeAppSetting);

  const handleSelectSetting = (
    setting: "appSetting" | "profile" | "resetPassword"
  ) => {
    setSelectedSetting(setting);
  };

  return (
    <dialog
      ref={useAppStore((state) => state.appSettingDialog)}
      className="outline-none rounded-lg h-full w-full md:h-auto md:w-fit relative dialog"
    >
      <div className="h-full">
        <h2 className="text-center mb-6 text-2xl font-semibold hidden">
          Settings
        </h2>
        <div className="flex h-full flex-col md:flex-row">
          <div className="order-2 md:border-r md:order-1">
            <div className="order-2 flex justify-between border-t border-t-blue-500 md:flex-col md:order-1 md:border-t-0 md:py-0">
              <div
                className={`w-full flex items-center justify-center p-2 ${
                  selectedSetting === "appSetting" && "bg-blue-500 text-white"
                }`}
                onClick={() => handleSelectSetting("appSetting")}
              >
                <SettingIcon
                  width={24}
                  height={24}
                  fill={
                    selectedSetting === "appSetting" ? "white" : "currentColor"
                  }
                />
                <h4
                  className={`hidden py-2 px-4 cursor-pointer rounded ${
                    selectedSetting === "appSetting" && "bg-blue-500 text-white"
                  } md:block`}
                >
                  app setting
                </h4>
              </div>
              <hr className="w-px bg-blue-500 h-full" />
              <div
                className={`w-full flex items-center justify-center p-2 ${
                  selectedSetting === "profile" && "bg-blue-500 text-white"
                }`}
                onClick={() => handleSelectSetting("profile")}
              >
                <ProfileIcon
                  width={24}
                  height={24}
                  fill={selectedSetting === "profile" ? "white" : "#000000"}
                />
                <h4
                  className={`hidden py-2 px-4 cursor-pointer rounded ${
                    selectedSetting === "profile" && "bg-blue-500 text-white"
                  } md:block`}
                >
                  profile
                </h4>
              </div>
              <hr className="w-px bg-blue-500 h-full" />
              <div
                className={`w-full flex items-center justify-center p-2 ${
                  selectedSetting === "resetPassword" &&
                  "bg-blue-500 text-white"
                }`}
                onClick={() => handleSelectSetting("resetPassword")}
              >
                <ResetPasswordIcon
                  width={24}
                  height={24}
                  fill={
                    selectedSetting === "resetPassword"
                      ? "white"
                      : "currentColor"
                  }
                />
                <h4
                  className={`hidden py-2 px-4 cursor-pointer rounded ${
                    selectedSetting === "resetPassword" &&
                    "bg-blue-500 text-white"
                  } md:block`}
                >
                  reset password
                </h4>
              </div>
            </div>
          </div>
          <div className="w-full flex-1 md:flex-none md:h-[400px] md:w-[600px] px-4 order-1 md:order-2">
            {selectedSetting === "appSetting" && <Settings />}
            {selectedSetting === "profile" && <Profile />}
            {selectedSetting === "resetPassword" && <ResetPassword />}
          </div>
        </div>
      </div>

      <span
        className="absolute top-0 right-0 cursor-pointer bg-red-500 rounded-full p-1 active:bg-red-600 md:hidden"
        onClick={handleCloseAppSetting}
      >
        <XIcon width={10} height={10} />
      </span>
    </dialog>
  );
};

export default AppSettings;
