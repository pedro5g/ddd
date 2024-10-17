import { Either, left, right } from "@/core/__error/either";
import { AnswerRepository } from "../repositories/answer-repository";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";

export interface UpdateAnswerUseCaseRequest {
  content: string;
  answerId: string;
  authorId: string;
}

export type UpdateAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class UpdateAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    content,
    answerId,
    authorId,
  }: UpdateAnswerUseCaseRequest): Promise<UpdateAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId) {
      return left(new NotAllowedError());
    }

    answer.updateContent(content);

    await this.answerRepository.update(answer);

    return right({});
  }
}
