import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordController } from './word.controller';
import { Word } from './word.entity';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), HttpModule],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
