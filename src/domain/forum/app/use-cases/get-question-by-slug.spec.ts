import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { GetQuestionBySlug } from "./get-question-by-slug";
import { makeQuestion } from "tests/factories/make-question";

let fakeRepo: InMemoryQuestionsRepository;

describe("Get Question By Slug Use Case", () => {
  beforeEach(() => {
    fakeRepo = new InMemoryQuestionsRepository();
  });

  it("Should be able to get a question by it slug", async () => {
    const newQuestion = makeQuestion();

    await fakeRepo.create(newQuestion);
    const getQuestionBySlug = new GetQuestionBySlug(fakeRepo);
    const { question: findQuestion } = await getQuestionBySlug.execute({
      slug: newQuestion.slug,
    });

    expect(findQuestion).toStrictEqual(newQuestion);
  });

  it("Should be throw a Error when trying get a question with a invalid slug", async () => {
    const newQuestion = makeQuestion();

    await fakeRepo.create(newQuestion);
    const getQuestionBySlug = new GetQuestionBySlug(fakeRepo);

    expect(
      async () =>
        await getQuestionBySlug.execute({
          slug: "fake-slug",
        })
    ).rejects.toThrow(new Error("Question not found error"));
  });
});
