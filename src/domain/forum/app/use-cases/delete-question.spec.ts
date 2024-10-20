import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { ResourceNotFoundError } from "./__errors/resource-not-found-error";
import { NotAllowedError } from "./__errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";
import { Question } from "../../enterprise/entities/question";
import { makeQuestionAttachment } from "tests/factories/make-question-attachment";

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkRepo: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;
let newQuestion: Question;
describe("Delete Question Use Case", () => {
  beforeEach(() => {
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fkRepo = new InMemoryQuestionsRepository(fkQuestionAttachmentRepo);
    sut = new DeleteQuestionUseCase(fkRepo);
    newQuestion = makeQuestion();
  });

  it("should be able to delete a question", async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items).toHaveLength(0);
  });

  it("should be able to delete a question with its attachments", async () => {
    await fkRepo.create(newQuestion);

    const questionAttachments = [
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
    ];

    questionAttachments.forEach(async (i) => {
      await fkQuestionAttachmentRepo.create(i);
    });

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionAttachmentRepo.items).toStrictEqual([]);
  });

  it("should be throw a Error when trying delete a question to pass invalid questionId", async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: "laskldjslaslj",
      authorId: newQuestion.authorId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be throw a Error when trying delete a question from another user", async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "kdajlklsahalfaskfla",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
