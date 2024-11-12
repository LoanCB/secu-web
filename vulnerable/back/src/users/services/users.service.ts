import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { CreateUserDto, FormattedCreatedUserDto } from '../dto/create-user.dto';
import { CustomHttpException } from 'src/common/helpers/custom.exception';
import { hash } from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ErrorCodesService } from 'src/common/services/error-codes.service';
import { PatchUserDto } from '../dto/patch-user.dto';
import { getEntityFilteredList } from 'src/common/helpers/filter-repository.helper';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { EntityFilteredListResults } from 'src/common/types/filter-repository.types';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  usersRepository: Repository<User>;

  @InjectRepository(Role)
  rolesRepository: Repository<Role>;

  constructor(private errorCodesService: ErrorCodesService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exist
    const isUserExist = await this.emailAlreadyExist(createUserDto.email);
    if (isUserExist) {
      throw new CustomHttpException('USER_EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
    }

    // Find related role
    const role = await this.rolesRepository.findOne({ where: { name: createUserDto.role } });

    // Hash password
    const hashedPassword = await hash(createUserDto.password, 10);

    const formattedCreateUser: FormattedCreatedUserDto = {
      ...createUserDto,
      role,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    };
    return await this.usersRepository.save({ ...formattedCreateUser } as Partial<User>);
  }

  async findAll(query: PaginationParamsDto): EntityFilteredListResults<User> {
    const [users, totalResults] = await getEntityFilteredList({
      repository: this.usersRepository,
      queryFilter: query,
      relations: [{ relation: 'role', alias: 'r' }],
      withDeleted: true,
    });
    return [users, users.length, totalResults];
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOneOrFail({
      where: { email },
      relations: { role: true },
      select: ['id', 'email', 'password'],
    });
  }

  async findOneById(id: number, withDeleted: boolean = true) {
    return await this.usersRepository.findOneOrFail({
      where: { id },
      relations: { role: true },
      withDeleted,
    });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    // Verify user email is unique
    if (updateUserDto.email && (await this.emailAlreadyExistOnOtherUser(user, updateUserDto.email))) {
      throw new CustomHttpException('USER_EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.role) {
      // Get user role
      const role = await this.rolesRepository.findOne({ where: { name: updateUserDto.role } });
      if (role) {
        user.role = role;
      }
    }

    // hash password
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ['role']: _, ...dto } = updateUserDto;
    Object.assign(user, dto);
    return await this.usersRepository.save(user);
  }

  async softDelete(id: number, patchUserDto: PatchUserDto) {
    const user = this.findOneById(id);
    if (!user) {
      throw new CustomHttpException(
        'USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        this.errorCodesService.get('USER_NOT_FOUND', id),
      );
    }

    return patchUserDto.isActive ? await this.activateUser(+id) : await this.deactivateUser(+id);
  }

  async activateUser(id: number) {
    const restoreResult = await this.usersRepository.restore(id);
    if (restoreResult.affected && restoreResult.affected > 0) {
      await this.usersRepository.update(id, { isActive: true });
    }
    return restoreResult;
  }

  async deactivateUser(id: number) {
    const deleteResult = await this.usersRepository.softDelete(id);
    if (deleteResult.affected && deleteResult.affected > 0) {
      await this.usersRepository.update({ id }, { isActive: false });
    }
    return deleteResult;
  }

  async emailAlreadyExist(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ? true : false;
  }

  async emailAlreadyExistOnOtherUser(user: User, email: string): Promise<boolean> {
    if (user.email === email) {
      return false;
    }

    const otherUser = await this.usersRepository.findOne({ where: { email } });
    return otherUser ? true : false;
  }
}
