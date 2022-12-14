import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDTO) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find().limit(limit).skip(offset).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findOne({ _id: term });
    } else {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }
    if (!pokemon) {
      throw new NotFoundException(`Pokemon not found : ${term}`);
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
    /*pokemon = await this.pokemonModel.findByIdAndUpdate(
      pokemon._id,
      updatePokemonDto,
    );*/
    //await pokemon.updateOne(updatePokemonDto, { new: true });
    //return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    const pokemon = await this.findOne(id);
    /*valida y elimina atraves del MongoID
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
      if(deletedCount === 0)
        throw new BadRequestException(
        `Pokemon with ${id} not exists in db`,
      );
    */
    await pokemon.deleteOne();
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(error.keyValue)} already exists in db`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't do the operation - Check server logs`,
    );
  }
}
