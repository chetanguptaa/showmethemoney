"use client";

import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import UsersRenderer, { TUserType } from "./usersRenderer";

const SearchUsers = ({ URLType }: { URLType: "request" | "send" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<TUserType[] | []>([]);
  const { toast } = useToast();

  const handleSearch = useDebouncedCallback(async (term: string) => {
    if (searchTerm.trim() !== "") {
      axios
        .get(`/api/users/search?query=${searchTerm}`)
        .then((response: any) => {
          setResult(response.data);
        })
        .catch((error: any) => {
          toast({
            variant: "destructive",
            title: "Failure.",
            description: "An Error Occoured please try again!!!",
          });
        });
    } else {
      setResult([]);
    }
  }, 300);

  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-8 pt-8 w-full sm:max-w-[600px] mx-auto">
        <Input
          placeholder="Enter user details"
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <button className="bg-orange-600 rounded-full h-8 w-8 ml-4 flex items-center justify-center  flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
          <SearchIcon className="text-white" size={18} />
        </button>
      </div>
      <UsersRenderer users={result} URLType={URLType} />
    </div>
  );
};

export default SearchUsers;
