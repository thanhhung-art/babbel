import { useMutation, useQuery } from "@tanstack/react-query";
import BellIcon from "../../assets/icons/BellIcon";
import Avatar from "../../components/Avatar";
import useAppStore from "../../lib/zustand/store";
import { logout, verifyUser } from "../../lib/react_query/queries/user/user";
import MenuIcon from "../../assets/icons/MenuIcon";
import SettingIcon from "../../assets/icons/SettingIcon";
import LogOutIcon from "../../assets/icons/LogOutIcon";
import { createRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dropdownMenu = useAppStore.getState().dropdownMenu;
  const dropdownParent = createRef<HTMLLIElement>();
  const toggleOpenSidebar = useAppStore((state) => state.toggleOpenSidebar);
  const toggleOpenDropdown = useAppStore((state) => state.toggleDropdownMenu);
  const handleOpenAppSetting = useAppStore((state) => state.openAppSetting);
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: verifyUser,
  });
  const navigation = useNavigate();

  const mutationLogOut = useMutation({
    mutationFn: logout,
  });

  const handleLogout = () => {
    mutationLogOut.mutate();
    navigation("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !dropdownParent.current?.contains(e.target as Node) &&
        !dropdownMenu.current?.contains(e.target as Node)
      ) {
        dropdownMenu.current?.classList.add("hidden");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownMenu, dropdownParent]);

  return (
    <nav className="border p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="md:hidden" onClick={toggleOpenSidebar}>
          <MenuIcon width={30} height={30} />
        </div>
        <h2>Chat app</h2>
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <BellIcon w={40} h={40} />
        </li>
        <li
          className="min-w-12 cursor-pointer relative"
          onClick={toggleOpenDropdown}
          ref={dropdownParent}
        >
          <Avatar
            height="h-12"
            width="w-12"
            name={data?.name}
            avatar={data?.avatar}
          />
          <div
            className="hidden absolute top-full right-0 mt-2 bg-white border rounded shadow-md z-50 "
            ref={useAppStore((state) => state.dropdownMenu)}
          >
            <ul className="">
              <li
                className="flex gap-2 items-center px-4 py-3 cursor-pointer hover:bg-slate-200 active:bg-slate-300"
                onClick={handleOpenAppSetting}
              >
                <SettingIcon width={20} height={20} /> Setting
              </li>
              <li
                className="flex gap-2 items-center px-4 py-3 cursor-pointer hover:bg-slate-200 active:bg-slate-300"
                onClick={handleLogout}
              >
                <LogOutIcon width={20} height={20} /> Logout
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
