import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { searchUsersQuery } from "../../lib/react_query/queries/user/user";
import { IUsersSearchQuery } from "../../types/user";

interface IProps {
  inputValue: React.MutableRefObject<HTMLInputElement | null>;
}

const useSearchUsers = ({ inputValue }: IProps) => {
  const deboundSearchRef = useRef<NodeJS.Timeout | null>(null);

  const searchUsersMutation = useMutation<IUsersSearchQuery[]>({
    mutationFn: async () => {
      return await searchUsersQuery(inputValue.current?.value || "");
    },
    onError: (error) => {
      console.error("Error searching users:", error);
    },
  });

  const handleSendSearch = async () => {
    if (inputValue.current && inputValue.current.value.length > 0) {
      clearTimeout(deboundSearchRef.current || 0);

      deboundSearchRef.current = setTimeout(() => {
        searchUsersMutation.mutate();
      }, 500);
    } else {
      searchUsersMutation.reset();
    }
  };

  return { searchUsersMutation, handleSendSearch };
};

export default useSearchUsers;
