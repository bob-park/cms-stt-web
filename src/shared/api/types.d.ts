type SearchPageParams = {
  page: number;
  size: number;
};

interface Pageable {
  pageNumber: number;
  pageSize: number;
}

/**
 * Page Response
 */
interface Page<T> {
  content: T[];
  pageable: Pageable;
  total: number;
}

/**
 * Page Request
 */
type PageRequest = {
  page: number;
  size: number;
};
