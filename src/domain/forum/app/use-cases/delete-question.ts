import { Either, left, right } from "@/core/__error/either";
import { QuestionRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";

export interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

export type DeleteQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);

    return right({});
  }
}
