import { Optional } from "@/core/types/optional";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { Comment } from "./comment";

export interface AnswerCommentProps {
  authorId: UniqueEntityId;
  answerId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get answerId(): string {
    return this.props.answerId.toString();
  }
}
