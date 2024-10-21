import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { GetQuestionBySlug } from "./get-question-by-slug";
import { makeQuestion } from "tests/factories/make-question";
import { ResourceNotFoundError } from "../../../../core/__error/__errors/resource-not-found-error";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;

let fakeRepo: InMemoryQuestionsRepository;
let sut: GetQuestionBySlug;

describe("Get Question By Slug Use Case", () => {
  beforeEach(() => {
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fakeRepo = new InMemoryQuestionsRepository(fkQuestionAttachmentRepo);
    sut = new GetQuestionBySlug(fakeRepo);
  });

  it("Should be able to get a question by it slug", async () => {
    const newQuestion = makeQuestion();

    await fakeRepo.create(newQuestion);

    const result = await sut.execute({
      slug: newQuestion.slug,
    });

    //@ts-ignore
    expect(result.value?.question).toStrictEqual(newQuestion);
  });

  it("Should be throw a Error when trying get a question with a invalid slug", async () => {
    const newQuestion = makeQuestion();

    await fakeRepo.create(newQuestion);

    const result = await sut.execute({
      slug: "fake-slug",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
