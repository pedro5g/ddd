import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionCommentsRepository } from "@/domain/forum/app/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comments";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  private _itens: QuestionComment[] = [];

  async create(comment: QuestionComment): Promise<void> {
    this._itens.push(comment);
    DomainEvents.dispatchEventsForAggregate(comment.id);
  }

  async delete(comment: QuestionComment): Promise<void> {
    this._itens = this._itens.filter((i) => i.id !== comment.id);
  }

  async update(comment: QuestionComment): Promise<void> {
    const commentInx = this._itens.findIndex((i) => i.id === comment.id);

    this._itens.splice(commentInx, 1, comment);
  }

  async findById(commentId: string): Promise<QuestionComment | null> {
    const comment = this._itens.find((i) => i.id.toString() === commentId);

    return comment ?? null;
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._itens
      .filter((i) => i.questionId === questionId)
      .slice(START, END);
  }

  get itens(): QuestionComment[] {
    return this._itens;
  }
}
