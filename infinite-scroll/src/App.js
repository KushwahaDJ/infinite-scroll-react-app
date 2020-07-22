import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, errors, books, hasMore } = useBookSearch(query, pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          // console.log("visible");
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      // console.log(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input
        type="text"
        value={query}
        placeholder="search here"
        onChange={handleSearch}
      />
      <div>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}
      </div>
      <div>{loading && "Loading..."}</div>
      <div>{errors && "Error"}</div>
    </>
  );
}

export default App;
