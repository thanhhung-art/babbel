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
    <div className="pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">App Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize your app experience
        </p>
      </div>

      {/* Settings List */}
      <div className="max-w-md mx-auto space-y-6">
        {/* Dark Mode Setting */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-medium text-gray-900">Dark Mode</h4>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
          </div>

          <label
            htmlFor="darkmode-switch"
            className="relative w-11 h-6 inline-block"
            onClick={handleTolggleDarkMode}
          >
            <input
              ref={darkMode}
              title="darkmode-switch"
              id="darkmode-switch"
              type="checkbox"
              className="sr-only peer"
            />
            <span
              className="absolute cursor-pointer inset-0 bg-gray-200 
                           rounded-full transition-all duration-200
                           peer-checked:bg-blue-500
                           after:content-[''] after:absolute after:top-0.5 
                           after:left-0.5 after:bg-white after:rounded-full
                           after:h-5 after:w-5 after:transition-all
                           peer-checked:after:translate-x-5
                           peer-focus:ring-2 peer-focus:ring-blue-500/50"
            ></span>
          </label>
        </div>

        {/* Notifications Setting */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-medium text-gray-900">Notifications</h4>
              <p className="text-sm text-gray-500">Get important updates</p>
            </div>
          </div>

          <label
            htmlFor="notifications-switch"
            className="relative w-11 h-6 inline-block"
            onClick={handleTolggleNotifications}
          >
            <input
              ref={notifications}
              title="notifications"
              id="notifications-switch"
              type="checkbox"
              className="sr-only peer"
            />
            <span
              className="absolute cursor-pointer inset-0 bg-gray-200 
                           rounded-full transition-all duration-200
                           peer-checked:bg-blue-500
                           after:content-[''] after:absolute after:top-0.5 
                           after:left-0.5 after:bg-white after:rounded-full
                           after:h-5 after:w-5 after:transition-all
                           peer-checked:after:translate-x-5
                           peer-focus:ring-2 peer-focus:ring-blue-500/50"
            ></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
