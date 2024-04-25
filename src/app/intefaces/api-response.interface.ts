export interface ApiResponse<Data = {} | [] | string | null | boolean> {
  errorMessages: string[],
  isSuccess: boolean,
  result: Data
}
