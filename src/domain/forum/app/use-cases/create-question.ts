import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/questions-repository";
import { Either, right } from "@/core/__error/either";

export interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
}

export type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      content,
      title,
    });

    await this.questionRepository.create(question);

    return right({ question });
  }
}
