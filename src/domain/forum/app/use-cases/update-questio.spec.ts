import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";

import { UpdateQuestionUseCase } from "./update-question";

let fkRepo: InMemoryQuestionsRepository;
describe("Update Question Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionsRepository();
  });

  it("should be able to update a question", async () => {
    const newQuestion = makeQuestion();
    //@ts-ignored
    const spyTouch = vitest.spyOn(newQuestion, "touch");
    await fkRepo.create(newQuestion);

    const updateQuestionUseCase = new UpdateQuestionUseCase(fkRepo);

    await updateQuestionUseCase.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id,
      authorId: newQuestion.authorId,
    });

    expect(fkRepo.items[0].content).toEqual("updated contente");
    expect(fkRepo.items[0].title).toEqual("updated title");
    expect(spyTouch).toBeCalledTimes(2);
  });

  it("should be throw a Error when trying update a question from another user", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const updateQuestionUseCase = new UpdateQuestionUseCase(fkRepo);

    expect(async () => {
      await updateQuestionUseCase.execute({
        title: "updated title",
        content: "updated contente",
        questionId: newQuestion.id,
        authorId: "fake-author-id-326378",
      });
    }).rejects.toThrow(new Error("Not allowed"));
  });
});
