import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
  update(answer: Answer): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
  findById(anotherId: string): Promise<Answer | null>;
}
