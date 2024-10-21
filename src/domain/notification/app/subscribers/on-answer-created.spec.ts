import { makeAnswer } from "tests/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "tests/repository/in-memory-answer-attachment-repository";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "tests/repository/in-memory-notification-repository";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";
import { makeQuestion } from "tests/factories/make-question";

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotification: SendNotificationUseCase;

let sut: OnAnswerCreated;

describe("On Answer Created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sut = new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification);
  });
  it("should send a notification when an answer is created", async () => {
    const spySendNotification = vi.spyOn(sendNotification, "execute");
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);
    const answer = makeAnswer({ questionId: question.id });

    await inMemoryAnswersRepository.create(answer);

    expect(spySendNotification).toHaveBeenCalledTimes(1);
  });
});
