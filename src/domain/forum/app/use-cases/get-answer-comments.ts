import { Either, right } from "@/core/__error/either";
import { AnswerComment } from "../../enterprise/entities/answer-comments";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";

export interface GetAnswerCommentsRequest {
  page: number;
  answerId: string;
}

export type GetAnswerCommentsResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

export class GetAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentRepository
  ) {}
  async execute({
    page,
    answerId,
  }: GetAnswerCommentsRequest): Promise<GetAnswerCommentsResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });
    return right({ answerComments });
  }
}
