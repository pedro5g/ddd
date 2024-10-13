import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/questions-repository";

export interface GetQuestionBySlugRequest {
  slug: string;
}

export interface GetQuestionBySlugResponse {
  question: Question;
}

export class GetQuestionBySlug {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      throw new Error("Question not found error");
    }

    return { question };
  }
}
