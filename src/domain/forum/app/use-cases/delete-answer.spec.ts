import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";

let fkRepo: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;
describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(fkRepo);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.itens).toHaveLength(0);
  });

  it("should be throw a Error when trying delete a answer to pass invalid questionId", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: "akdjlassjlfajfl",
      authorId: newAnswer.authorId,
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be throw a Error when trying delete a answer from another user", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "kajdlkajsljladjd",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
