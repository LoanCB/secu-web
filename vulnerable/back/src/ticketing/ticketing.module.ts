import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './controllers/tickets.controller';
import { File } from './entities/files.entity';
import { Ticket } from './entities/tickets.entity';
import { TicketsService } from './services/tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, File])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [],
})
export class TicketingModule {}
