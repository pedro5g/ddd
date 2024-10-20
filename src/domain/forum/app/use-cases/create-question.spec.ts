import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionAttachmentsRepository } from "tests/repository/in-memory-question-attachments-repository";

let fakeQuestionRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;
describe("Create Question Use Case", () => {
  beforeEach(() => {
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fakeQuestionRepository = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo
    );
    sut = new CreateQuestionUseCase(fakeQuestionRepository);
  });
  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "123456",
      content: "content test",
      title: "test",
      attachmentsIds: ["1", "2", "3"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.question.content).toEqual("content test");
    expect(result.value?.question.title).toEqual("test");
    expect(result.value?.question.authorId).toEqual("123456");
    expect(fakeQuestionRepository.items[0].attachments.getItems()).toHaveLength(
      3
    );
  });
});
