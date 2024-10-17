import { Either, left, right } from "@/core/__error/either";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";

export interface DeleteQuestionCommentUseCaseRequest {
  commentId: string;
  authorId: string;
}

export type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly answerCommentRepository: QuestionCommentRepository
  ) {}
  async execute({
    commentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const answerComment = await this.answerCommentRepository.findById(
      commentId
    );

    if (!answerComment) {
      return left(new ResourceNotFoundError("Question comment not found "));
    }

    if (authorId !== answerComment.authorId) {
      return left(new NotAllowedError("Not allowed"));
    }

    await this.answerCommentRepository.delete(answerComment);

    return right({});
  }
}
