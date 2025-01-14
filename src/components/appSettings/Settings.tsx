import { useRef } from "react";

const Settings = () => {
  const darkMode = useRef<HTMLInputElement>(null);
  const notifications = useRef<HTMLInputElement>(null);

  const handleTolggleDarkMode = () => {
    if (darkMode.current) {
      darkMode.current.checked = !darkMode.current?.checked;
    }
  };

  const handleTolggleNotifications = () => {
    if (notifications.current) {
      notifications.current.checked = !notifications.current?.checked;
    }
  };

  return (
    <div className="mt-2">
      <div>
        <div className="mt-2 flex justify-between items-center">
          <h4 className="mb-1">Dark Mode</h4>
          <label
            htmlFor="darkmode-switch"
            className="relative w-[40px] h-[24px] inline-block"
            onClick={handleTolggleDarkMode}
          >
            <input
              ref={darkMode}
              title="darkmode-switch"
              id="darkmode-switch"
              type="checkbox"
              className="w-0 h-0 peer switch"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 transition-all peer-checked:bg-blue-500 peer-focus:shadow slider rounded-[30px]"></span>
          </label>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <h4 className="mb-1">Notifications</h4>
          <label
            htmlFor="notifications-switch"
            className="relative w-[40px] h-[24px] inline-block"
            onClick={handleTolggleNotifications}
          >
            <input
              ref={notifications}
              title="notifications"
              id="notifications-switch"
              type="checkbox"
              className="w-0 h-0 peer switch"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 transition-all peer-checked:bg-blue-500 peer-focus:shadow slider rounded-[30px]"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
