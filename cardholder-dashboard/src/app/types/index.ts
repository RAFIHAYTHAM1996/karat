export interface ClientData<T> {
  data?: T;
  fetch: () => Promise<any>;
  isLoading: boolean;
}
