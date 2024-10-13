import { AnswerRepository } from "../repositories/answer-repository";

export interface UpdateAnswerUseCaseRequest {
  content: string;
  answerId: string;
  authorId: string;
}

export interface UpdateAnswerUseCaseResponse {}

export class UpdateAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    content,
    answerId,
    authorId,
  }: UpdateAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw new Error("Question not found error");
    }

    if (authorId !== answer.authorId) {
      throw new Error("Not allowed");
    }

    answer.updateContent(content);

    await this.answerRepository.update(answer);
  }
}
