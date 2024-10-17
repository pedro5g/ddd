import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { QuestionRepository } from "@/domain/forum/app/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionRepository {
  private _itens: Question[] = [];

  async create(question: Question): Promise<void> {
    this._itens.push(question);
  }

  async update(question: Question): Promise<void> {
    const qstIndex = this._itens.findIndex((i) => i.id === question.id);
    this._itens.splice(qstIndex, 1, question);
  }

  async delete(question: Question): Promise<void> {
    const qstIndex = this._itens.findIndex((i) => i.id !== question.id);

    this._itens.splice(qstIndex, 1);
  }
  async getManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const LIMIT: number = 20;

    const questions = this._itens
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * LIMIT, page * LIMIT);

    return questions;
  }

  async findById(questionId: string): Promise<Question | null> {
    const _question = this._itens.find((i) => i.id.toString() === questionId);

    return _question ?? null;
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this._itens.find((i) => i.slug === slug);

    return question ?? null;
  }

  get items(): Question[] {
    return this._itens;
  }
}
