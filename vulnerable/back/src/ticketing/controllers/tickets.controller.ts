import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { CommonSwaggerResponse } from 'src/common/helpers/common-swagger-config.helper';
import { CustomHttpException } from 'src/common/helpers/custom.exception';
import { ErrorCodesService } from 'src/common/services/error-codes.service';
import { PaginatedList } from 'src/common/types/pagination-params.types';
import { Roles } from 'src/users/decorators/roles.decorator';
import { User } from 'src/users/entities/users.entity';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { RoleType } from 'src/users/types/role-type';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UsersListDto } from '../dto/tickets-list.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { Ticket } from '../entities/tickets.entity';
import { TicketsService } from '../services/tickets.service';

@Controller({
  path: 'tickets',
  version: ['1'],
})
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Tickets')
@CommonSwaggerResponse()
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly errorCodesService: ErrorCodesService,
  ) {}

  @Get()
  @Roles(RoleType.READ_ONLY)
  async findAll(@Query() query: UsersListDto): Promise<PaginatedList<Ticket>> {
    const [tickets, currentResults, totalResults] = await this.ticketsService.findAll(query);
    return { ...query, totalResults, currentResults, results: tickets };
  }

  @Get(':id')
  @Roles(RoleType.READ_ONLY)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ticketsService.findOneById(id);
    } catch (error) {
      throw new CustomHttpException(
        'TICKET_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        this.errorCodesService.get('TICKET_NOT_FOUND', id),
      );
    }
  }

  @Post()
  @Roles(RoleType.READ_ONLY)
  async create(@Body() createTicketDto: CreateTicketDto, @GetUser() user: User) {
    return await this.ticketsService.createTicketWithFiles(createTicketDto, user);
  }

  @Patch(':id')
  @Roles(RoleType.READ_ONLY)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketsService.findOneById(id);
    return await this.ticketsService.update(ticket, updateTicketDto);
  }

  @Delete(':id')
  @Roles(RoleType.READ_ONLY)
  @HttpCode(204)
  async archive(@Param('id', ParseIntPipe) id: number) {
    await this.ticketsService.archive(id);
  }
}
