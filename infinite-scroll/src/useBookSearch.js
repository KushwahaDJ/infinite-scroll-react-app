import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setErrors(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        setBooks(prevBooks => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
        setErrors(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, errors, books, hasMore };
}
