import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comments";
import { AnswerRepository } from "../repositories/answer-repository";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { Either, left, right } from "@/core/__error/either";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";

export interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

export type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly answerCommentsRepository: AnswerCommentRepository
  ) {}
  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const newComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(newComment);

    return right({
      answerComment: newComment,
    });
  }
}
