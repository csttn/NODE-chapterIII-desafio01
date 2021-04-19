import { createQueryBuilder, getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userGames = await this.repository
      .createQueryBuilder("users")
      .innerJoin("user.games", "games")
      .where("user.uuid = :id", { id: user_id })
      .getRawOne();
    return userGames;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder("users")
      .select("users.first_name", "*")
      .orderBy("users.first_name", "ASC")
      .getRawMany();
    // Complete usando raw query

    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository
      .createQueryBuilder("users")
      .where("LOWER(users.first_name = :first_name)", { first_name })
      .andWhere("LOWER(users.last_name = :last_name)", { last_name })
      .getRawMany();

    return user;

    // Complete usando raw query
  }
}
