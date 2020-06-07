import { HttpClient } from './httpClient';
import { AxiosRequestConfig } from 'axios';

class ExternalHttpClient extends HttpClient {
  public constructor(config?: AxiosRequestConfig) {
    super(config);
  }

  public uploadFile = (uploadUrl: string, file: File) =>
    this.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    }).then(this.success);
}

export { ExternalHttpClient };
