import { QuestionRepository } from "../repositories/questions-repository";

export interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

export interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<void> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found error");
    }

    if (authorId !== question.authorId) {
      throw new Error("Not allowed");
    }

    await this.questionRepository.delete(question);
  }
}
