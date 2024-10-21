import { Either, left, right } from "@/core/__error/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "../../../../core/__error/__errors/resource-not-found-error";

export interface GetQuestionBySlugRequest {
  slug: string;
}

export type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlug {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
