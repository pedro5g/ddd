import { Optional } from "@/core/types/optional";
import { Entity } from "src/core/domain/entities/entity";
import { UniqueEntityId } from "src/core/domain/value-objects/unique-entity-id";
import { AnswerAttachmentList } from "./answer-attachment-list";

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  attachment: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  public static create(
    props: Optional<AnswerProps, "createdAt" | "attachment">,
    id?: UniqueEntityId
  ) {
    return new Answer(
      {
        ...props,
        attachment: props.attachment ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get shortContent(): string {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  public updateContent(content: string) {
    this.props.content = content;
    this.touch();
  }

  public setAttachment(attachments: AnswerAttachmentList): void {
    this.props.attachment = attachments;
    // this.touch();
  }

  get attachment(): AnswerAttachmentList {
    return this.props.attachment;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId.value;
  }

  get questionId(): string {
    return this.props.questionId.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
