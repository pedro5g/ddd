import { SendNotificationUseCase } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "tests/repository/in-memory-notification-repository";
import { makeQuestionComment } from "tests/factories/make-comment";
import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";
import { OnQuestionCommentCreated } from "./on-question-comment-created";
import { InMemoryQuestionCommentsRepository } from "tests/repository/in-memory-question-comments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sendNotification: SendNotificationUseCase;

let sut: OnQuestionCommentCreated;

describe("On Question Comment Created", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sut = new OnQuestionCommentCreated(
      inMemoryQuestionsRepository,
      sendNotification
    );
  });
  it("should send a notification when to create a new question comment", async () => {
    const spySendNotification = vi.spyOn(sendNotification, "execute");
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);
    const questionComment = makeQuestionComment({ questionId: question.id });
    await inMemoryQuestionCommentsRepository.create(questionComment);

    expect(spySendNotification).toHaveBeenCalledTimes(1);
  });
});
