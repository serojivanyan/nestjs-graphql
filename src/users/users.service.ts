import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import has = Reflect.has;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, password, firstName, lastName, role } = createUserInput;
    const emailToLowerCase = email.toLocaleLowerCase();
    const isExists = await this.userRepository.findOne({
      email: emailToLowerCase,
    });
    if (isExists) {
      throw new ConflictException('User with those email already exists');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email: emailToLowerCase,
      password: hashPassword,
      firstName,
      lastName,
      role,
    });
    return await this.userRepository.save(user);
  }
  async login(
    loginUserInput: LoginUserInput,
  ): Promise<{ id: number; token: string }> {
    const { email, password } = loginUserInput;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    const verifyPassword = await bcrypt.compareSync(password, user.password);
    if (!verifyPassword) {
      throw new ForbiddenException('Incorrect email or password');
    }
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return { id: user.id, token };
  }

  async findAll(): Promise<Array<User>> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserInput,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return {
      id: id,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      posts: [],
    };
  }
}
