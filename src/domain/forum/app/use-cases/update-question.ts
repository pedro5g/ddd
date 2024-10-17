import { Either, left, right } from "@/core/__error/either";
import { QuestionRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";

export interface UpdateQuestionUseCaseRequest {
  title: string;
  content: string;
  questionId: string;
  authorId: string;
}

export type UpdateQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class UpdateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    title,
    content,
    questionId,
    authorId,
  }: UpdateQuestionUseCaseRequest): Promise<UpdateQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId) {
      return left(new NotAllowedError());
    }

    question.updateContent(content);
    question.updateTitle(title);

    await this.questionRepository.update(question);
    return right({});
  }
}
