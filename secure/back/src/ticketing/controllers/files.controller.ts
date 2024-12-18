import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommonSwaggerResponse } from 'src/common/helpers/common-swagger-config.helper';
import { CustomHttpException } from 'src/common/helpers/custom.exception';
import { ErrorCodesService } from 'src/common/services/error-codes.service';
import { PaginatedList } from 'src/common/types/pagination-params.types';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { RoleType } from 'src/users/types/role-type';
import { FilesListDto } from '../dto/files-list.dto';
import { File } from '../entities/files.entity';
import { FilesService } from '../services/files.service';

@Controller({
  path: 'files',
  version: ['1'],
})
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Tickets')
@CommonSwaggerResponse()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly errorCodesService: ErrorCodesService,
  ) {}

  @Get()
  @Roles(RoleType.MANAGER)
  async findAll(@Query() query: FilesListDto): Promise<PaginatedList<File>> {
    const [files, currentResults, totalResults] = await this.filesService.findAll(query);
    return { ...query, totalResults, currentResults, results: files };
  }

  @Get(':id')
  @Roles(RoleType.READ_ONLY)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.filesService.findOneById(id);
    } catch (error) {
      throw new CustomHttpException(
        'FILE_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        this.errorCodesService.get('FILE_NOT_FOUND', id),
      );
    }
  }

  @Post('attachToTicket/:ticketId')
  @Roles(RoleType.READ_ONLY)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Param('ticketId', ParseIntPipe) ticketId: number) {
    await this.filesService.create({ fileName: file.originalname, path: file.path, size: file.size, ticketId });
  }

  @Delete(':id/delete')
  @Roles(RoleType.READ_ONLY)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.filesService.delete(id);
  }

  @Delete(':id/archive')
  @Roles(RoleType.READ_ONLY)
  async archive(@Param('id', ParseIntPipe) id: number) {
    await this.filesService.archive(id);
  }
}
