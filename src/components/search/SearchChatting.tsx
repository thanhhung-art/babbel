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
    <div className="relative w-full">
      <div
        className="flex items-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-lg 
                   hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 
                   focus-within:ring-blue-100 transition-all duration-200"
        ref={searchContainer}
      >
        <SearchIcon
          width={18}
          height={18}
          className="text-gray-400 flex-shrink-0"
        />
        <input
          id="search-chat"
          type="text"
          placeholder="Search conversations..."
          className="w-full text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          onFocus={handleOpenSearch}
          ref={inputRef}
          onChange={handleSendSearch}
        />
        <button
          onClick={handleSearchChatting}
          className="p-1.5 rounded-md hover:bg-gray-100 active:bg-gray-200 
                     transition-colors duration-200 flex-shrink-0"
          aria-label="Search"
        >
          <SearchIcon width={18} height={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SearchChatting;
