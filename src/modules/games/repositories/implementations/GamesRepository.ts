import { count } from "node:console";
import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where("games.title like :title", { title: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const countGames = await this.repository
      .createQueryBuilder("games")
      .select("SUM(games.title)", "sum")
      .getRawOne();

    return countGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const userGames = await this.repository
      .createQueryBuilder("users_games_games")
      .where("users_games_games.gamesId = :id", { id: id })
      .getRawMany();

    return userGames;
  }
}
