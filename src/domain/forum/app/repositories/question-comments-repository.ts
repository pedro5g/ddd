import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comments";

export interface QuestionCommentRepository {
  create(comment: QuestionComment): Promise<void>;
  update(comment: QuestionComment): Promise<void>;
  delete(comment: QuestionComment): Promise<void>;
  findById(commentId: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<QuestionComment[]>;
}
