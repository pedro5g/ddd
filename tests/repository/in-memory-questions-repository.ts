import { QuestionRepository } from "@/domain/forum/app/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionRepository {
  private _items: Question[] = [];

  async create(question: Question): Promise<void> {
    this._items.push(question);
  }

  async update(question: Question): Promise<void> {
    const qstIndex = this._items.findIndex((i) => i.id === question.id);
    this._items.splice(qstIndex, 1, question);
  }

  async delete(question: Question): Promise<void> {
    const qstIndex = this._items.findIndex((i) => i.id !== question.id);

    this._items.splice(qstIndex, 1);
  }

  async findById(questionId: string): Promise<Question | null> {
    const _question = this._items.find((i) => i.id === questionId);

    return _question ?? null;
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this._items.find((i) => i.slug === slug);

    return question ?? null;
  }

  get items(): Question[] {
    return this._items;
  }
}
