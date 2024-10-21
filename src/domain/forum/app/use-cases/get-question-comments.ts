import { Either, right } from "@/core/__error/either";
import { QuestionComment } from "../../enterprise/entities/question-comments";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

export interface GetQuestionCommentsRequest {
  page: number;
  questionId: string;
}

export type GetQuestionCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class GetQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {}
  async execute({
    page,
    questionId,
  }: GetQuestionCommentsRequest): Promise<GetQuestionCommentsResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });
    return right({ questionComments });
  }
}
