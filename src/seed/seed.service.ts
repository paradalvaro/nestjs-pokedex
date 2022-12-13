import { Injectable } from '@nestjs/common';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {
  //private readonly http = fetch;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonSercive: PokemonService,
    private readonly http: FetchAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    //const data: PokeResponse = await res.json();
    const arrayPokemon: CreatePokemonDto[] = [];
    data.results.forEach(({ name, url }) => {
      //data.results.forEach((pokemon) => {
      //this.saveDB(pokemon);
      const no = url.split('/').at(-2);
      const pokemon: CreatePokemonDto = { name: name, no: +no };
      arrayPokemon.push(pokemon);
    });
    await this.pokemonModel.insertMany(arrayPokemon);
    return `Seed executed`;
  }

  /*private async executeSeedAllPromise() {
    await this.pokemonModel.deleteMany({});
    const res = await this.http('https://pokeapi.co/api/v2/pokemon?limit=10');
    const data: PokeResponse = await res.json();
    const arrayPromises: Promise<Pokemon>[] = [];
    data.results.forEach(({ name, url }) => {
      //data.results.forEach((pokemon) => {
      //this.saveDB(pokemon);
      const no = url.split('/').at(-2);
      arrayPromises.push(this.pokemonModel.create({ name: name, no: +no }));
    });
    await Promise.all(arrayPromises);
    return `Seed executed`;
  }*/

  /*private async saveDB(pokemon: Result) {
    const no = pokemon.url.split('/').at(-2);
    const savePokemon: CreatePokemonDto = { name: pokemon.name, no: +no };
    await this.pokemonModel.create(savePokemon);
    //await this.pokemonSercive.create(savePokemon);
  }*/
}
