import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { getEntityFilteredList } from 'src/common/helpers/filter-repository.helper';
import { EntityFilteredListResults } from 'src/common/types/filter-repository.types';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { Ticket } from '../entities/tickets.entity';
import { CreateFileDto } from './../dto/create-file.dto';
import { FilesService } from './files.service';

@Injectable()
export class TicketsService {
  @InjectRepository(Ticket)
  ticketsRepository: Repository<Ticket>;

  constructor(private readonly filesService: FilesService) {}

  async findAll(query: PaginationParamsDto): EntityFilteredListResults<Ticket> {
    const [tickets, totalResults] = await getEntityFilteredList({
      repository: this.ticketsRepository,
      queryFilter: query,
      relations: [
        { relation: 'files', alias: 'f' },
        { relation: 'user', alias: 'u' },
      ],
    });
    return [tickets, tickets.length, totalResults];
  }

  async findOneById(id: number, withDeleted: boolean = true) {
    return await this.ticketsRepository.findOneOrFail({
      where: { id },
      relations: { files: true },
      withDeleted,
    });
  }

  async createTicketWithFiles(
    createTicketDto: CreateTicketDto,
    user: User,
    files: Express.Multer.File[] = [],
  ): Promise<Ticket> {
    const ticket = await this.ticketsRepository.save({ ...createTicketDto, user });
    files.forEach(async (file) => {
      const fileDto: CreateFileDto = {
        fileName: file.originalname,
        path: file.path,
        size: file.size,
        ticketId: ticket.id,
      };
      await this.filesService.create(fileDto);
    });

    return ticket;
  }

  async update(ticket: Ticket, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    return await this.ticketsRepository.save({ ...ticket, ...updateTicketDto });
  }

  async archive(id: number) {
    return await this.ticketsRepository.softDelete({ id });
  }

  async countTicketAndFileByUser(userId: number) {
    const results = await this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoin('ticket.files', 'file')
      .where('ticket.userId = :userId', { userId })
      .select('COUNT(DISTINCT ticket.id)', 'ticketCount')
      .addSelect('COUNT(file.id)', 'fileCount')
      .getRawOne();

    return {
      ticketCount: parseInt(results.ticketCount, 10),
      fileCount: parseInt(results.fileCount, 10),
    };
  }
}
