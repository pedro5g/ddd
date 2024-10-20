import { Slug } from "src/core/domain/value-objects/slug";
import { UniqueEntityId } from "src/core/domain/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { AggregateRoot } from "@/core/domain/entities/aggregate-root";
import { QuestionAttachmentList } from "./question-attachment-list";

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  public static create(
    {
      createdAt,
      ...props
    }: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityId
  ) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.toSlug(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: createdAt ?? new Date(),
      },
      id
    );
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private updateSlug(text: string) {
    this.props.slug = Slug.toSlug(text);
  }

  public updateContent(content: string) {
    this.props.content = content;
    this.touch();
  }

  public updateTitle(title: string) {
    this.props.title = title;
    this.updateSlug(title);
    this.touch();
  }

  public setBeastAnswerId(id: UniqueEntityId) {
    this.props.bestAnswerId = id;
  }

  public setAttachments(attachment: QuestionAttachmentList) {
    this.props.attachments = attachment;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get shortContent(): string {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  get slug(): string {
    return this.props.slug.value;
  }

  get authorId(): string {
    return this.props.authorId.value;
  }

  get bestAnswerId(): string | undefined {
    return this.props.bestAnswerId?.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
