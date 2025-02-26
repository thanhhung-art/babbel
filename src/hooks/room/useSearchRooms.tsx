import { useMutation } from "@tanstack/react-query";
import { IRoomSearchQuery } from "../../types/room";
import { useRef } from "react";
import { searchRoomByNameQuery } from "../../lib/react_query/queries/room/room";

interface IProps {
  inputValue: React.MutableRefObject<HTMLInputElement | null>;
}

const useSearchRooms = ({ inputValue }: IProps) => {
  const deboundSearchRef = useRef<NodeJS.Timeout | null>(null);

  const searchRoomsMutation = useMutation<IRoomSearchQuery[]>({
    mutationFn: async () => {
      return await searchRoomByNameQuery(inputValue.current?.value || "");
    },
    onError: (error) => {
      console.error("Error searching rooms:", error);
    },
  });

  const handleSendSearch = async () => {
    if (inputValue.current && inputValue.current.value.length > 0) {
      clearTimeout(deboundSearchRef.current || 0);

      deboundSearchRef.current = setTimeout(() => {
        searchRoomsMutation.mutate();
      }, 500);
    } else {
      searchRoomsMutation.reset();
    }
  };

  return { searchRoomsMutation, handleSendSearch };
};

export default useSearchRooms;
