import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export interface AnswerAttachmentsRepository {
  create(questionAttachment: AnswerAttachment): Promise<void>;
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}
