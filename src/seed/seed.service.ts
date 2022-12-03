import { Injectable } from '@nestjs/common';
import { PokeResponse, Result } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly http = fetch;
  async executeSeed() {
    const res = await this.http('https://pokeapi.co/api/v2/pokemon?limit=10');
    const data: PokeResponse = await res.json();
    data.results.forEach(({ name, url }) => {
      const no = url.split('/').at(-2);
      console.log({ no, name });
    });
    return `This action returns all seed`;
  }
}
