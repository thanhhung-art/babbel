import Sidebar from "./sidebar/Sidebar";
import ChatFrame from "./chat_frame/ChatFrame";
import Navbar from "./Navbar";
import useHandleClickOutside from "../../hooks/utils/useHandleClickOutside";
import AppSettings from "../../components/appSettings/AppSettings";
import useConnectSocketIO from "../../hooks/utils/useConnectSocketIO";
import useAppStore from "../../lib/zustand/store";

const Home = () => {
  useConnectSocketIO();

  useHandleClickOutside();

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow relative overflow-hidden">
        <article
          className="absolute overflow-hidden -left-[100vw] w-full h-full z-30 transition-all duration-300 md:static md:w-1/4 md:h-auto"
          ref={useAppStore((state) => state.sideBarContainer)}
        >
          <Sidebar />
        </article>
        <div className="w-full md:w-3/4">
          <ChatFrame />
        </div>
      </div>
      {/* App Setting */}
      <AppSettings />
    </div>
  );
};

export default Home;
