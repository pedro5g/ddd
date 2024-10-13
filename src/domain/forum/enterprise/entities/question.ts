import { Slug } from "src/core/domain/value-objects/slug";
import { Entity } from "src/core/domain/entities/entity";
import { UniqueEntityId } from "src/core/domain/value-objects/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import dayjs from "dayjs";

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {
  public static create(
    props: Optional<QuestionProps, "createdAt" | "slug">,
    id?: UniqueEntityId
  ) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.toSlug(props.title),
        createdAt: new Date(),
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

  set beastAnswerId(id: UniqueEntityId) {
    this.props.bestAnswerId = id;
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
