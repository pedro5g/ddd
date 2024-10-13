import { AnswerRepository } from "../repositories/answer-repository";

export interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

export interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found error");
    }

    if (authorId !== answer.authorId) {
      throw new Error("Not allowed");
    }

    await this.answerRepository.delete(answer);
  }
}
