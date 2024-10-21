import { PaginationParams } from "@/core/domain/repository/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comments";

export interface AnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>;
  update(comment: AnswerComment): Promise<void>;
  delete(comment: AnswerComment): Promise<void>;
  findById(commentId: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    props: PaginationParams
  ): Promise<AnswerComment[]>;
}
