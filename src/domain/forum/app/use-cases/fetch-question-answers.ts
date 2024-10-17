import { Either, right } from "@/core/__error/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";

export interface FetchQuestionAnswersRequest {
  page: number;
  questionId: string;
}

export type FetchQuestionAnswersResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      {
        page,
      }
    );
    return right({ answers });
  }
}
