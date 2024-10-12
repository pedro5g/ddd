import { AnswerRepository } from "@/domain/forum/app/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
  private _intens: Answer[] = [];

  async create(answer: Answer): Promise<void> {
    this._intens.push(answer);
  }

  get itens(): Answer[] {
    return this._intens;
  }
}
