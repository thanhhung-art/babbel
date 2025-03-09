import { createRef, useRef } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchChattingQuery } from "../../lib/react_query/queries/user/user";
import { chatting } from "../../utils/contants";
import { IChatting } from "../../types/conversation";

const SearchChatting = () => {
  const inputRef = createRef<HTMLInputElement>();
  const searchContainer = createRef<HTMLDivElement>();
  const dataResultsContainer = createRef<HTMLDivElement>();
  const queryClient = useQueryClient();
  const deboundSearchRef = useRef<NodeJS.Timeout | null>(null);

  const searchChattingMutation = useMutation({
    mutationFn: (name: string) => {
      return searchChattingQuery(name);
    },
    onSuccess: (data: IChatting[]) => {
      queryClient.setQueryData<IChatting[]>([chatting], data);
    },
  });

  const handleOpenSearch = () => {
    dataResultsContainer.current?.classList.remove("hidden");
    dataResultsContainer.current?.classList.add("block");
  };

  const handleSearchChatting = async () => {
    const value = inputRef.current?.value ?? "";
    if (value) {
      searchChattingMutation.mutate(value);
    }
  };

  const handleSendSearch = async () => {
    if (inputRef.current && inputRef.current.value.length > 0) {
      clearTimeout(deboundSearchRef.current || 0);

      deboundSearchRef.current = setTimeout(() => {
        if (inputRef.current)
          searchChattingMutation.mutate(inputRef.current.value);
      }, 500);
    } else {
      searchChattingMutation.reset();
      queryClient.invalidateQueries({ queryKey: [chatting] });
    }
  };

  return (
    <div>
      <div
        className="border rounded-lg bg-white flex items-center relative search-container"
        ref={searchContainer}
      >
        <div className="flex-1 pl-3">
          <label htmlFor="search-chat" className="border w-full">
            <input
              id="search-chat"
              type="text"
              placeholder="Search chats..."
              className="w-full outline-none"
              onFocus={handleOpenSearch}
              ref={inputRef}
              onChange={handleSendSearch}
            />
          </label>
        </div>
        <span
          className="cursor-pointer border p-2"
          onClick={handleSearchChatting}
        >
          <SearchIcon width={24} height={24} />
        </span>
      </div>
    </div>
  );
};

export default SearchChatting;
