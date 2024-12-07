import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { User } from 'src/users/entities/users.entity';
import { RoleType } from 'src/users/types/role-type';
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

  async findAll(query: PaginationParamsDto, user: User) {
    const rawQuery = this.ticketsRepository.createQueryBuilder('ticket').innerJoinAndSelect('ticket.user', 'user');
    if (user.role.name !== RoleType.ADMINISTRATOR) {
      rawQuery.where(`user.id = ${user.id}`);
    }
    const [results, totalResults] = await rawQuery.getManyAndCount();
    return { totalResults, results };
  }

  async findOneById(id: string) {
    return await this.ticketsRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.user', 'user')
      .where(`ticket.id = ${id}`)
      .getMany();
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
