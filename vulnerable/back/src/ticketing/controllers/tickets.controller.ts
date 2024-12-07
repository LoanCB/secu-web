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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
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

  @Get('count')
  @Roles(RoleType.READ_ONLY)
  async counters(@GetUser() user: User) {
    return this.ticketsService.countTicketAndFileByUser(user.id);
  }

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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    console.log(JSON.stringify(createTicketDto));
    return await this.ticketsService.createTicketWithFiles(createTicketDto, user, files);
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
