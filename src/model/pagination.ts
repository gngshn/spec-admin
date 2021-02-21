export interface Pagination<T> {
  total: number
  skip: number
  limit: number
  data: Array<T>
}