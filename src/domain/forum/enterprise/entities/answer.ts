import { Optional } from "src/core/@types/optional";
import { Entity } from "src/core/domain/entities/entity";
import { UniqueEntityId } from "src/core/domain/value-objects/unique-entity-id";

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  public static create(
    props: Optional<AnswerProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new Answer(
      {
        ...props,
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
