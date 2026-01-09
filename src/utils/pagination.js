export function paginate({ totalItems, currentPage = 1, pageSize = 10 }) {
  const totalPages = Math.ceil(totalItems / pageSize)

  const safePage = Math.min(Math.max(currentPage, 1), totalPages)

  const start = (safePage - 1) * pageSize
  const end = start + pageSize

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    start,
    end,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages
  }
}
