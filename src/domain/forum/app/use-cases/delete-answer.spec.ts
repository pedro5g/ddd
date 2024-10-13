import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";

let fkRepo: InMemoryAnswersRepository;
describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    fkRepo = new InMemoryAnswersRepository();
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const deleteQuestionUseCase = new DeleteAnswerUseCase(fkRepo);

    await deleteQuestionUseCase.execute({
      answerId: newAnswer.id,
      authorId: newAnswer.authorId,
    });

    expect(fkRepo.itens).toHaveLength(0);
  });

  it("should be throw a Error when trying delete a answer to pass invalid questionId", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const deleteQuestionUseCase = new DeleteAnswerUseCase(fkRepo);

    expect(async () => {
      await deleteQuestionUseCase.execute({
        answerId: "akdjlassjlfajfl",
        authorId: newAnswer.authorId,
      });
    }).rejects.toThrow(new Error("Answer not found error"));
  });

  it("should be throw a Error when trying delete a answer from another user", async () => {
    const newAnswer = makeAnswer();
    await fkRepo.create(newAnswer);

    const deleteQuestionUseCase = new DeleteAnswerUseCase(fkRepo);

    expect(async () => {
      await deleteQuestionUseCase.execute({
        answerId: newAnswer.id,
        authorId: "kajdlkajsljladjd",
      });
    }).rejects.toThrow(new Error("Not allowed"));
  });
});
