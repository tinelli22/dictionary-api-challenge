import {
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Query,
  CacheTTL,
} from '@nestjs/common';
import { WordService } from './word.service';

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get('add-data-to-database')
  async addData() {
    const resp = await this.wordService.readFileAndSaveInDB();
    if (!resp) throw new InternalServerErrorException();
    return HttpStatus.OK;
  }

  @Get()
  @CacheTTL(0)
  getData(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ) {
    return this.wordService.getWordsByPagination({
      page,
      limit,
    });
  }
}
