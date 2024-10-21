import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { UpdateQuestionUseCase } from "./update-question";
import { NotAllowedError } from "../../../../core/__error/__errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";
import { Question } from "../../enterprise/entities/question";
import { makeQuestionAttachment } from "tests/factories/make-question-attachment";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

let fkQuestionRepo: InMemoryQuestionsRepository;
let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let sut: UpdateQuestionUseCase;

let newQuestion: Question;

describe("Update Question Use Case", () => {
  beforeEach(() => {
    fkQuestionRepo = new InMemoryQuestionsRepository(fkQuestionAttachmentRepo);
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    sut = new UpdateQuestionUseCase(fkQuestionRepo, fkQuestionAttachmentRepo);

    newQuestion = makeQuestion();
  });

  it("should be able to update a question", async () => {
    //@ts-ignored
    const spyTouch = vitest.spyOn(newQuestion, "touch");
    await fkQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: [],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionRepo.items[0].content).toEqual("updated contente");
    expect(fkQuestionRepo.items[0].title).toEqual("updated title");
    expect(fkQuestionRepo.items[0].attachments.getItems()).toEqual([]);
    expect(spyTouch).toBeCalledTimes(2);
  });

  it("should be able to update attachments in an question", async () => {
    await fkQuestionRepo.create(newQuestion);

    const questionAttachments = [
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("3"),
      }),
    ];

    questionAttachments.forEach(async (i) => {
      await fkQuestionAttachmentRepo.create(i);
    });

    const result = await sut.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: ["1", "3", "4"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionRepo.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("4") }),
    ]);
  });

  it("should be throw a Error when trying update a question from another user", async () => {
    await fkQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      title: "updated title",
      content: "updated contente",
      questionId: newQuestion.id.toString(),
      authorId: "fake-author-id-326378",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
