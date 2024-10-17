import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionRepository {
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  update(question: Question): Promise<void>;
  findById(questionId: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  getManyRecent({ page }: PaginationParams): Promise<Question[]>;
}
