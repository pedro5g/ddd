import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";

let fkRepo: InMemoryQuestionsRepository;
describe("Delete Question Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryQuestionsRepository();
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const deleteQuestionUseCase = new DeleteQuestionUseCase(fkRepo);

    await deleteQuestionUseCase.execute({
      questionId: newQuestion.id,
      authorId: newQuestion.authorId,
    });

    expect(fkRepo.items).toHaveLength(0);
  });

  it("should be throw a Error when trying delete a question to pass invalid questionId", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const deleteQuestionUseCase = new DeleteQuestionUseCase(fkRepo);

    expect(async () => {
      await deleteQuestionUseCase.execute({
        questionId: "laskldjslaslj",
        authorId: newQuestion.authorId,
      });
    }).rejects.toThrow(new Error("Question not found error"));
  });

  it("should be throw a Error when trying delete a question from another user", async () => {
    const newQuestion = makeQuestion();
    await fkRepo.create(newQuestion);

    const deleteQuestionUseCase = new DeleteQuestionUseCase(fkRepo);

    expect(async () => {
      await deleteQuestionUseCase.execute({
        questionId: newQuestion.id,
        authorId: "kdajlklsahalfaskfla",
      });
    }).rejects.toThrow(new Error("Not allowed"));
  });
});
