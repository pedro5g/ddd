import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "tests/repository/in-memory-question-comments-repository";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { makeQuestionComment } from "tests/factories/make-comment";
import { GetQuestionCommentsUseCase } from "./get-question-comments";

let fkRepo: InMemoryQuestionCommentsRepository;
let sut: GetQuestionCommentsUseCase;
describe("Get Question Comments Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionCommentsRepository();
    sut = new GetQuestionCommentsUseCase(fkRepo);
  });

  it("should be able to list comments of question", async () => {
    const newQuestion = makeQuestion();

    for (let i = 0; i < 21; i++) {
      const questionComment = makeQuestionComment({
        authorId: new UniqueEntityId("test-author-id"),
        questionId: newQuestion.id,
        content: "contente test",
      });

      await fkRepo.create(questionComment);
    }

    const result = await sut.execute({
      page: 1,
      questionId: newQuestion.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questionComments).toHaveLength(20);
  });
  it("should be able to paginate comments of question", async () => {
    const newQuestion = makeQuestion();

    for (let i = 0; i < 21; i++) {
      const questionComment = makeQuestionComment({
        authorId: new UniqueEntityId("test-author-id"),
        questionId: newQuestion.id,
        content: "contente test",
      });

      await fkRepo.create(questionComment);
    }

    const result = await sut.execute({
      page: 2,
      questionId: newQuestion.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questionComments).toHaveLength(1);
  });
});
