import { useQuery } from "@tanstack/react-query";
import BellIcon from "../../assets/icons/BellIcon";
import Avatar from "../../components/Avatar";
import useAppStore from "../../lib/zustand/store";
import { verifyUser } from "../../lib/react_query/queries/user/user";

const Navbar = () => {
  const toggleSidebarRight = useAppStore((state) => state.toggleSidebarRight);
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: verifyUser,
  });

  return (
    <nav className="border p-4 flex justify-between items-center">
      <h2>Chat app</h2>
      <ul className="flex gap-8 items-center">
        <li>
          <BellIcon w={40} h={40} />
        </li>
        <li onClick={toggleSidebarRight} className="min-w-12 cursor-pointer">
          <Avatar
            height="h-12"
            width="w-12"
            name={data?.name}
            avatar={data?.avatar}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
