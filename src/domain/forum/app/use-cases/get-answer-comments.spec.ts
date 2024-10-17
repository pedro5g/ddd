import { makeAnswer } from "tests/factories/make-answer";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { makeAnswerComment } from "tests/factories/make-comment";
import { GetAnswerCommentsUseCase } from "./get-answer-comments";
import { InMemoryAnswersCommentsRepository } from "tests/repository/in-memory-answer-comments-repository";

let fkRepo: InMemoryAnswersCommentsRepository;
let sut: GetAnswerCommentsUseCase;
describe("Get Answer Comments Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryAnswersCommentsRepository();
    sut = new GetAnswerCommentsUseCase(fkRepo);
  });

  it("should be able to list comments of question", async () => {
    const newAnswer = makeAnswer();

    for (let i = 0; i < 21; i++) {
      const questionComment = makeAnswerComment({
        authorId: new UniqueEntityId("test-author-id"),
        answerId: newAnswer.id,
        content: "contente test",
      });

      await fkRepo.create(questionComment);
    }

    const result = await sut.execute({
      page: 1,
      answerId: newAnswer.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answerComments).toHaveLength(20);
  });
  it("should be able to paginate comments of question", async () => {
    const newAnswer = makeAnswer();

    for (let i = 0; i < 21; i++) {
      const questionComment = makeAnswerComment({
        authorId: new UniqueEntityId("test-author-id"),
        answerId: newAnswer.id,
        content: "contente test",
      });

      await fkRepo.create(questionComment);
    }

    const result = await sut.execute({
      page: 2,
      answerId: newAnswer.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answerComments).toHaveLength(1);
  });
});
