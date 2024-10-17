import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";

let fkRepo: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;
describe("Delete Question Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(fkRepo);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items).toHaveLength(0);
  });

  it("should be throw a Error when trying delete a question to pass invalid questionId", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: "laskldjslaslj",
      authorId: newQuestion.authorId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be throw a Error when trying delete a question from another user", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "kdajlklsahalfaskfla",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
