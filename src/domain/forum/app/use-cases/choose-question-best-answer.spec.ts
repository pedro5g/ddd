import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { Question } from "../../enterprise/entities/question";
import { makeQuestion } from "tests/factories/make-question";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { NotAllowedError } from "./__errors/not-allowed-error";

let fkAnswerRepository: InMemoryAnswersRepository;
let fkQuestionRepository: InMemoryQuestionsRepository;
let question: Question;
let sut: ChooseQuestionBestAnswerUseCase;
describe("Choose Question Best Answer Use Case", () => {
  beforeEach(async () => {
    fkAnswerRepository = new InMemoryAnswersRepository();
    fkQuestionRepository = new InMemoryQuestionsRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      fkAnswerRepository,
      fkQuestionRepository
    );

    question = makeQuestion();
    await fkQuestionRepository.create(question);
  });

  it("should be able to set a best answer in a question", async () => {
    const newAnswer = makeAnswer({
      questionId: question.id,
    });

    await fkAnswerRepository.create(newAnswer);

    expect(question.bestAnswerId).toBeUndefined();
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: question.authorId,
    });

    const item = fkQuestionRepository.items[0];

    expect(result.isRight()).toBeTruthy();
    expect(item.bestAnswerId).not.toBeUndefined();
    expect(item.bestAnswerId).toEqual(newAnswer.id.toString());
  });

  it("should be not able to set a best answer in a question from another user", async () => {
    const newAnswer = makeAnswer({
      questionId: question.id,
    });

    await fkAnswerRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "fake-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
