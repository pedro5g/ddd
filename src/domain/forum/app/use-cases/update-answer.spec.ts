import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { UpdateAnswerUseCase } from "./update-answer";

let fkRepo: InMemoryAnswersRepository;
describe("Update Answer Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryAnswersRepository();
  });

  it("should be able to update a answer", async () => {
    const newAnswer = makeAnswer();
    //@ts-ignored
    const spyTouch = vitest.spyOn(newAnswer, "touch");
    await fkRepo.create(newAnswer);

    const updateQuestionUseCase = new UpdateAnswerUseCase(fkRepo);

    await updateQuestionUseCase.execute({
      content: "updated contente",
      answerId: newAnswer.id,
      authorId: newAnswer.authorId,
    });

    expect(fkRepo.itens[0].content).toEqual("updated contente");
    expect(spyTouch).toBeCalledTimes(1);
  });

  it("should be throw a Error when trying update a answer from another user", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const updateQuestionUseCase = new UpdateAnswerUseCase(fkRepo);

    expect(async () => {
      await updateQuestionUseCase.execute({
        content: "updated contente",
        answerId: newAnswer.id,
        authorId: "fake-author-id-326378",
      });
    }).rejects.toThrow(new Error("Not allowed"));
  });
});
