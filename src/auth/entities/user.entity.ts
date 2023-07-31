import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '18ace258-24c0-4141-bf3f-65c7e6947a49',
    description: 'Unique identifier for this user',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email',
    required: true,
    example: 'fF2zv@example.com',
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    description: 'User password',
    required: true,
    example: 'Abc123456',
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'User full name',
    required: true,
    example: 'Daniel Echegaray',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    description: 'User is active',
    example: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User roles',
    required: true,
    example: ['user', 'admin'],
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
