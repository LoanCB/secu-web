import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getEntityFilteredList } from 'src/common/helpers/filter-repository.helper';
import { EntityFilteredListResults } from 'src/common/types/filter-repository.types';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../dto/create-file.dto';
import { FilesListDto } from '../dto/files-list.dto';
import { File } from '../entities/files.entity';

@Injectable()
export class FilesService {
  @InjectRepository(File)
  filesRepository: Repository<File>;

  async create(createFileDto: CreateFileDto) {
    return await this.filesRepository.save(createFileDto);
  }

  async delete(id: number): Promise<void> {
    await this.filesRepository.delete({ id });
  }

  async findAll(query: FilesListDto): EntityFilteredListResults<File> {
    const [files, totalResults] = await getEntityFilteredList({
      repository: this.filesRepository,
      queryFilter: query,
      withDeleted: query.withDeleted,
    });
    return [files, files.length, totalResults];
  }

  async findOneById(id: number): Promise<File> {
    return await this.filesRepository.findOneOrFail({ where: { id } });
  }

  async archive(id: number) {
    return await this.filesRepository.softDelete({ id });
  }
}
