import { makeQuestion } from "tests/factories/make-question";
import { Question } from "../../enterprise/entities/question";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "tests/repository/in-memory-answer-attachment-repository";

let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;

let fakeRepo: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;
let newQuestion: Question;

describe("Fetch Question Answers Use Case", () => {
  beforeEach(() => {
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fakeRepo = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    sut = new FetchQuestionAnswersUseCase(fakeRepo);
    newQuestion = makeQuestion();
  });

  it("Should be able to return questions ordered to recent date", async () => {
    for (let i = 0; i < 41; i++) {
      await fakeRepo.create(makeAnswer({ questionId: newQuestion.id }));
    }

    let result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(20);
    result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 3,
    });

    expect(result.value?.answers).toHaveLength(1);
  });
});
