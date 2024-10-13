import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { UpdateAnswerUseCase } from "./update-answer";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { Question } from "../../enterprise/entities/question";
import { makeQuestion } from "tests/factories/make-question";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

let fkAnswerRepository: InMemoryAnswersRepository;
let fkQuestionRepository: InMemoryQuestionsRepository;
let question: Question;
describe("Chose Question Best Answer Use Case", () => {
  beforeEach(async () => {
    fkAnswerRepository = new InMemoryAnswersRepository();
    fkQuestionRepository = new InMemoryQuestionsRepository();

    question = makeQuestion();
    await fkQuestionRepository.create(question);
  });

  it("should be able to set a best answer in a question", async () => {
    const newAnswer = makeAnswer({
      questionId: new UniqueEntityId(question.id),
    });

    await fkAnswerRepository.create(newAnswer);
    const chooseQuestBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
      fkAnswerRepository,
      fkQuestionRepository
    );

    expect(question.beastAnswerId).toBeUndefined();
    await chooseQuestBestAnswerUseCase.execute({
      answerId: newAnswer.id,
      authorId: question.authorId,
    });

    expect(question.bestAnswerId).not.toBeUndefined();
    expect(question.bestAnswerId).toEqual(newAnswer.id);
  });
  it("should be not able to set a best answer in a question from another user", async () => {
    const newAnswer = makeAnswer({
      questionId: new UniqueEntityId(question.id),
    });

    await fkAnswerRepository.create(newAnswer);
    const chooseQuestBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
      fkAnswerRepository,
      fkQuestionRepository
    );

    expect(async () => {
      await chooseQuestBestAnswerUseCase.execute({
        answerId: newAnswer.id,
        authorId: "fake-id",
      });
    }).rejects.toThrowError();
  });
});
