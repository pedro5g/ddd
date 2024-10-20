import { Optional } from "@/core/types/optional";
import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

export interface CommentProps {
  authorId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<T extends CommentProps> extends Entity<T> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  public updateContent(content: string) {
    this.props.content = content;
    this.touch();
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId.toString();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
