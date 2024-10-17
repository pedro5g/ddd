import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { UpdateAnswerUseCase } from "./update-answer";
import { NotAllowedError } from "./__errors/not-allowed-error";

let fkRepo: InMemoryAnswersRepository;
let sut: UpdateAnswerUseCase;
describe("Update Answer Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryAnswersRepository();
    sut = new UpdateAnswerUseCase(fkRepo);
  });

  it("should be able to update a answer", async () => {
    const newAnswer = makeAnswer();
    //@ts-ignored
    const spyTouch = vitest.spyOn(newAnswer, "touch");
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      content: "updated contente",
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.itens[0].content).toEqual("updated contente");
    expect(spyTouch).toBeCalledTimes(1);
  });

  it("should be throw a Error when trying update a answer from another user", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      content: "updated contente",
      answerId: newAnswer.id.toString(),
      authorId: "fake-author-id-326378",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
