import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Este email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        status: 'active',
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        roles: {
          include: { role: { select: { id: true, name: true } } },
        },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        status: true,
        roles: {
          include: { role: { select: { id: true, name: true } } },
        },
        student: true,
        advisor: true,
        coordinator: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { id: true, email: true, name: true, phone: true, status: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });
    return { message: `Usuário ${id} marcado como inativo` };
  }

  async assignRole(userId: number, assignRoleDto: AssignRoleDto) {
    const { roleId } = assignRoleDto;

    await this.findOne(userId);
    const roleExists = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!roleExists) throw new NotFoundException('Role não encontrada');

    const existing = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
    if (existing) throw new ConflictException('Usuário já possui este papel');

    return this.prisma.userRole.create({
      data: { userId, roleId },
      include: { role: true },
    });
  }

  async removeRole(userId: number, roleId: number) {
    const existing = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
    if (!existing)
      throw new NotFoundException('Relação usuário-role não encontrada');

    await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });
    return { message: 'Papel removido com sucesso' };
  }
}
