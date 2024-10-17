import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { AnswerRepository } from "@/domain/forum/app/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
  private _intens: Answer[] = [];

  async create(answer: Answer): Promise<void> {
    this._intens.push(answer);
  }

  async delete(answer: Answer): Promise<void> {
    const aswIndex = this._intens.findIndex((i) => i.id === answer.id);

    this._intens.splice(aswIndex, 1);
  }

  async update(answer: Answer): Promise<void> {
    const aswIndex = this._intens.findIndex((i) => i.id === answer.id);

    this._intens.splice(aswIndex, 1, answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const LIMIT: number = 20;

    const answers = this._intens
      .filter((i) => i.questionId === questionId)
      .slice((page - 1) * LIMIT, page * LIMIT);

    return answers;
  }

  async findById(answerId: string): Promise<Answer | null> {
    const _answer = this._intens.find((i) => i.id.toString() === answerId);

    return _answer ?? null;
  }

  get itens(): Answer[] {
    return this._intens;
  }
}
