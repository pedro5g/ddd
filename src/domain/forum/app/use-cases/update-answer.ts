import { Either, left, right } from "@/core/__error/either";
import { AnswerRepository } from "../repositories/answer-repository";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachment-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

export interface UpdateAnswerUseCaseRequest {
  content: string;
  attachmentsIds: string[];
  answerId: string;
  authorId: string;
}

export type UpdateAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class UpdateAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}
  async execute({
    content,
    attachmentsIds,
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

    const currentAttachment =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);
    const answerAttachmentsList = new AnswerAttachmentList(currentAttachment);

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentsList.update(answerAttachments);
    answer.setAttachment(answerAttachmentsList);
    answer.updateContent(content);

    await this.answerRepository.update(answer);

    return right({});
  }
}
