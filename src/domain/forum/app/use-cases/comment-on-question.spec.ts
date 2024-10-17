import { InMemoryQuestionCommentsRepository } from "tests/repository/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { makeQuestion } from "tests/factories/make-question";
import { QuestionComment } from "../../enterprise/entities/question-comments";

let fakeQuestionRepo: InMemoryQuestionsRepository;
let fakeQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Tests Comment On Question Use Case", () => {
  beforeEach(() => {
    fakeQuestionRepo = new InMemoryQuestionsRepository();
    fakeQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      fakeQuestionRepo,
      fakeQuestionCommentsRepo
    );
  });

  it("Should be able to comment in a question", async () => {
    const newQuestion = makeQuestion();
    await fakeQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      authorId: "fake-author-id",
      questionId: newQuestion.id.toString(),
      content: "this is a test content",
    });
    expect(result.isRight()).toBeTruthy();
    //@ts-ignore
    expect(result.value?.questionComment).toBeInstanceOf(QuestionComment);
    //@ts-ignore
    expect(result.value?.questionComment).toEqual(
      fakeQuestionCommentsRepo.itens[0]
    );
  });
});
