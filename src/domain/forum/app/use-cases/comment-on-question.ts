import { QuestionRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comments";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { Either, left, right } from "@/core/__error/either";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";

export interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

export type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionCommentsRepository: QuestionCommentRepository
  ) {}
  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const newComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.questionCommentsRepository.create(newComment);

    return right({
      questionComment: newComment,
    });
  }
}
