import { Either, left, right } from "@/core/__error/either";
import { QuestionRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

export interface UpdateQuestionUseCaseRequest {
  title: string;
  content: string;
  attachmentsIds: string[];
  questionId: string;
  authorId: string;
}

export type UpdateQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class UpdateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}
  async execute({
    title,
    content,
    attachmentsIds,
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

    const currentAttachment =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentAttachment
    );

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(id),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.updateContent(content);
    question.updateTitle(title);
    question.setAttachments(questionAttachmentList);

    await this.questionRepository.update(question);
    return right({});
  }
}
