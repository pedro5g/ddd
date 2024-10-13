import { QuestionRepository } from "../repositories/questions-repository";

export interface UpdateQuestionUseCaseRequest {
  title: string;
  content: string;
  questionId: string;
  authorId: string;
}

export interface UpdateQuestionUseCaseResponse {}

export class UpdateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    title,
    content,
    questionId,
    authorId,
  }: UpdateQuestionUseCaseRequest): Promise<void> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found error");
    }

    if (authorId !== question.authorId) {
      throw new Error("Not allowed");
    }

    question.updateContent(content);
    question.updateTitle(title);

    await this.questionRepository.update(question);
  }
}
