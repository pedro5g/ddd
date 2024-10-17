import { AnswerQuestionUseCase } from "./answer-question";
import { AnswerRepository } from "../repositories/answer-repository";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";

let fakeAnswersRepository: AnswerRepository;

beforeEach(() => {
  fakeAnswersRepository = new InMemoryAnswersRepository();
});
test("create an answer", async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

  const contentTest = {
    questionId: "1232",
    instructorId: "343",
    content: "this is a test message",
  };

  const result = await answerQuestion.execute(contentTest);

  expect(result.isRight()).toBeTruthy();
  expect(result.value?.answer.content).toEqual(contentTest.content);
});
