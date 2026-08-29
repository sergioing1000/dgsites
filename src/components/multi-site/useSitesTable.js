import { useMemo, useState } from "react";

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export default function useSitesTable(sites) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "baseStation",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSites = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!query) return sites;

    return sites.filter((site) =>
      Object.values(site).some((value) =>
        String(value).toLocaleLowerCase().includes(query)
      )
    );
  }, [searchTerm, sites]);

  const sortedSites = useMemo(
    () =>
      [...filteredSites].sort((left, right) => {
        const comparison = collator.compare(
          String(left[sortConfig.key] ?? ""),
          String(right[sortConfig.key] ?? "")
        );
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }),
    [filteredSites, sortConfig]
  );

  const totalPages = Math.max(1, Math.ceil(sortedSites.length / rowsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleSites = useMemo(() => {
    const start = (visiblePage - 1) * rowsPerPage;
    return sortedSites.slice(start, start + rowsPerPage);
  }, [rowsPerPage, sortedSites, visiblePage]);

  const changeSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const changeRowsPerPage = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const sortBy = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const reset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
    filteredCount: sortedSites.length,
    page: visiblePage,
    rowsPerPage,
    searchTerm,
    sortConfig,
    totalPages,
    visibleSites,
    actions: {
      changeRowsPerPage,
      changeSearch,
      nextPage: () => setCurrentPage((page) => page + 1),
      previousPage: () => setCurrentPage((page) => page - 1),
      reset,
      sortBy,
    },
  };
}
