import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as fs from 'fs';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Word } from './word.entity';

@Injectable()
export class WordService {
  private dictionaryUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  constructor(
    @InjectRepository(Word)
    private readonly repository: Repository<Word>,
    private readonly httpService: HttpService,
  ) {}

  async readFileAndSaveInDB() {
    const promise = new Promise<boolean>((res, rej) => {
      const stream = fs.createReadStream('./src/english.txt', {
        encoding: 'utf-8',
      });

      if (!stream) rej(false);

      stream.on('data', (chunk) => {
        const words = chunk as string;
        const array = words.split(/\r?\n/);

        array.forEach((word) => {
          this.repository.save({ name: word });
        });
        res(true);
      });

      stream.on('error', (err) => {
        console.error(err);
        rej(false);
      });
    });

    return promise;
  }

  async getWordsByPagination(options: IPaginationOptions) {
    return paginate<Word>(this.repository, options);
  }

  async getWord(name: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.dictionaryUrl}/${name}`,
      );

      return data;
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }
}
