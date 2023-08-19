import React from "react";
import searchImg from "../../assets/images/search.png";

const Search = () => {
  return (
    <div className="flex items-center gap-2 h-9 bg-white rounded-md px-2 py-1">
      <input
        name="search"
        className="w-full rounded-none py-0 border-r-2 border-red-800"
        type="text"
        placeholder="Search..."
      />
      <img className="h-5 mr-1" src={searchImg} alt="searchIcon" />
    </div>
  );
};

export default Search;
