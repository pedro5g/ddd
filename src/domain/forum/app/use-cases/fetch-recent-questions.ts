import { Either, right } from "@/core/__error/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/questions-repository";

export interface FetchRecentQuestionsRequest {
  page: number;
}

export type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.getManyRecent({ page });
    return right({ questions });
  }
}
