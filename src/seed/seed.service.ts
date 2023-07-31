/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async runSeed() {
    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.insertNewProducts(firstUser);

    return 'Seeds executed';
  }
  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const query = await this.userRepository.createQueryBuilder();
    await query.delete().where({}).execute();
  }
  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
        })
      );
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }
  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const promises = [];

    products.forEach((product) => {
      promises.push(this.productService.create(product, user));
    });

    await Promise.all(promises);

    return true;
  }
}
