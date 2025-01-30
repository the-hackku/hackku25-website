// hooks/useSearchablePaginatedData.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface UseSearchablePaginatedDataProps<T> {
  fetchFunction: (
    page: number,
    pageSize: number,
    searchQuery: string
  ) => Promise<{ data: T[]; total: number }>;
  pageSize?: number;
  debounceTime?: number;
}

export function useSearchablePaginatedData<T>({
  fetchFunction,
  pageSize = 10,
  debounceTime = 500,
}: UseSearchablePaginatedDataProps<T>) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [searchQuery, debounceTime]);

  // Memoize `fetchFunction` so it doesn't change on each render
  // cannot use `useMemo` because it doesn't work with async functions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFetchFunction = useCallback(fetchFunction, []);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await memoizedFetchFunction(
        page,
        pageSize,
        debouncedSearch
      );
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, memoizedFetchFunction]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    total,
    loading,
    page,
    totalPages,
    searchQuery,
    setPage,
    setSearchQuery,
    fetchData,
  };
}
