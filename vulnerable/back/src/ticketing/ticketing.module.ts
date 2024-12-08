import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './controllers/files.controller';
import { TicketsController } from './controllers/tickets.controller';
import { File } from './entities/files.entity';
import { Ticket } from './entities/tickets.entity';
import { FilesService } from './services/files.service';
import { TicketsService } from './services/tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, File])],
  controllers: [TicketsController, FilesController],
  providers: [TicketsService, FilesService],
  exports: [],
})
export class TicketingModule {}
