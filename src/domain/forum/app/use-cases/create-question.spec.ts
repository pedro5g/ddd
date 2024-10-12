import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let fakeQuestionRepository: InMemoryQuestionsRepository;

describe("Create Question Use Case", () => {
  beforeEach(() => {
    fakeQuestionRepository = new InMemoryQuestionsRepository();
  });
  it("should be able to create a question", async () => {
    const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository);

    const contentTest = {
      authorId: "123456",
      content: "content test",
      title: "test",
    };

    const { question } = await createQuestion.execute(contentTest);

    expect(question.content).toEqual(contentTest.content);
    expect(question.title).toEqual(contentTest.title);
    expect(question.authorId).toEqual(contentTest.authorId);
    expect(fakeQuestionRepository.items[0]).toStrictEqual(question);
  });
});
