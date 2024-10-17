import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "tests/repository/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { makeQuestionComment } from "tests/factories/make-comment";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { Question } from "../../enterprise/entities/question";

let fkRepo: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;
let newQuestion: Question;
describe("Delete Question Comment Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(fkRepo);
    newQuestion = makeQuestion();
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId("test-author-id"),
      questionId: newQuestion.id,
      content: "contente test",
    });

    await fkRepo.create(questionComment);

    await sut.execute({
      authorId: "test-author-id",
      commentId: questionComment.id.toString(),
    });

    expect(fkRepo.itens).toHaveLength(0);
  });
  it("should return an error when trying to delete a question comment that does not exist", async () => {
    const result = await sut.execute({
      authorId: "test-author-id",
      commentId: "fake_id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it("should return an error when trying to delete a question comment another user", async () => {
    const answerComment = makeQuestionComment({
      authorId: new UniqueEntityId(),
      questionId: newQuestion.id,
      content: "contente test",
    });

    await fkRepo.create(answerComment);

    const result = await sut.execute({
      authorId: "test-author-id",
      commentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
