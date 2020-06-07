import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

class HttpClient {
  private readonly instance: AxiosInstance;

  public constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create(config);

    this.getUri = this.getUri.bind(this);
    this.request = this.request.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
    this.head = this.head.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
  }

  public getUri(config?: AxiosRequestConfig): string {
    return this.instance.getUri(config);
  }

  public request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.instance.request(config);
  }

  public get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.get(url, config);
  }

  public delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.delete(url, config);
  }

  public head<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.head(url, config);
  }

  public options<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.options(url, config);
  }

  public post<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.post(url, data, config);
  }

  public put<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.put(url, data, config);
  }

  public patch<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.patch(url, data, config);
  }

  public success<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  public error(error: AxiosError<Error>) {
    throw error;
  }
}

export { HttpClient };
