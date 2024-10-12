import { QuestionRepository } from "@/domain/forum/app/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionRepository {
  private _items: Question[] = [];

  async create(question: Question): Promise<void> {
    this._items.push(question);
  }

  get items(): Question[] {
    return this._items;
  }
}
