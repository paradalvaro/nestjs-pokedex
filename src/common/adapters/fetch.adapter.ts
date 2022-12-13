import { Injectable } from '@nestjs/common';
import { HttpAdapter } from 'src/common/interfaces/http-adapter.interface';
@Injectable()
export class FetchAdapter implements HttpAdapter {
  private http = fetch;

  async get<T>(url: string): Promise<T> {
    try {
      const res = await this.http(url);
      return await res.json();
    } catch (e) {
      throw new Error(e);
    }
  }
}
