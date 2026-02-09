import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ example: 1, description: 'ID do papel a ser atribuído' })
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}
