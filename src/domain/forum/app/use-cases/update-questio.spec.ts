import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";

import { UpdateQuestionUseCase } from "./update-question";
import { NotAllowedError } from "./__errors/not-allowed-error";

let fkRepo: InMemoryQuestionsRepository;
let sut: UpdateQuestionUseCase;
describe("Update Question Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionsRepository();
    sut = new UpdateQuestionUseCase(fkRepo);
  });

  it("should be able to update a question", async () => {
    const newQuestion = makeQuestion();
    //@ts-ignored
    const spyTouch = vitest.spyOn(newQuestion, "touch");
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items[0].content).toEqual("updated contente");
    expect(fkRepo.items[0].title).toEqual("updated title");
    expect(spyTouch).toBeCalledTimes(2);
  });

  it("should be throw a Error when trying update a question from another user", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id.toString(),
      authorId: "fake-author-id-326378",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
