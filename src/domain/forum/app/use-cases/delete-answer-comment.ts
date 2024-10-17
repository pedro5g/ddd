import { Either, left, right } from "@/core/__error/either";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";

export interface DeleteAnswerCommentUseCaseRequest {
  commentId: string;
  authorId: string;
}

export type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentRepository
  ) {}
  async execute({
    commentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentRepository.findById(
      commentId
    );

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answerComment.authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentRepository.delete(answerComment);

    return right({});
  }
}
