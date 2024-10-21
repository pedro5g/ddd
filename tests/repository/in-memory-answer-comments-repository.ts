import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { DomainEvents } from "@/core/events/domain-events";
import { AnswerCommentsRepository } from "@/domain/forum/app/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comments";

export class InMemoryAnswersCommentsRepository
  implements AnswerCommentsRepository
{
  private _itens: AnswerComment[] = [];

  async create(comment: AnswerComment): Promise<void> {
    this._itens.push(comment);
    DomainEvents.dispatchEventsForAggregate(comment.id);
  }

  async delete(comment: AnswerComment): Promise<void> {
    this._itens = this._itens.filter((i) => i.id !== comment.id);
  }

  async update(comment: AnswerComment): Promise<void> {
    const commentInx = this._itens.findIndex((i) => i.id === comment.id);

    this._itens.splice(commentInx, 1, comment);
  }

  async findById(commentId: string): Promise<AnswerComment | null> {
    const comment = this._itens.find((i) => i.id.toString() === commentId);

    return comment ?? null;
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._itens.filter((i) => i.answerId === answerId).slice(START, END);
  }

  get itens(): AnswerComment[] {
    return this._itens;
  }
}
