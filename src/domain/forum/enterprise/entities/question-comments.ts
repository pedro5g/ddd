import { Optional } from "@/core/types/optional";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { Comment } from "./comment";

export interface QuestionCommentProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get questionId(): string {
    return this.props.questionId.toString();
  }
}
