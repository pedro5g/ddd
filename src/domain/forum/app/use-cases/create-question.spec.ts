import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let fakeQuestionRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;
describe("Create Question Use Case", () => {
  beforeEach(() => {
    fakeQuestionRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(fakeQuestionRepository);
  });
  it("should be able to create a question", async () => {
    const contentTest = {
      authorId: "123456",
      content: "content test",
      title: "test",
    };

    const result = await sut.execute(contentTest);

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.question.content).toEqual(contentTest.content);
    expect(result.value?.question.title).toEqual(contentTest.title);
    expect(result.value?.question.authorId).toEqual(contentTest.authorId);
    expect(fakeQuestionRepository.items[0]).toStrictEqual(
      result.value?.question
    );
  });
});
