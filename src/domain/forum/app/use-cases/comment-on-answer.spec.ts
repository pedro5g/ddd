import { InMemoryAnswersCommentsRepository } from "tests/repository/in-memory-answer-comments-repository";
import { AnswersRepository } from "../repositories/answer-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryAnswersRepository } from "tests/repository/in-memory-answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comments";
import { InMemoryAnswerAttachmentsRepository } from "tests/repository/in-memory-answer-attachment-repository";

let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;

let fakeAnswerRepo: AnswersRepository;
let fakeAnswerCommentsRepo: InMemoryAnswersCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("Tests Comment On Answer Use Case", () => {
  beforeEach(() => {
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fakeAnswerRepo = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    fakeAnswerCommentsRepo = new InMemoryAnswersCommentsRepository();

    sut = new CommentOnAnswerUseCase(fakeAnswerRepo, fakeAnswerCommentsRepo);
  });

  it("Should be able to comment in a answer", async () => {
    const newAnswer = makeAnswer();
    await fakeAnswerRepo.create(newAnswer);

    const result = await sut.execute({
      authorId: "fake-author-id",
      answerId: newAnswer.id.toString(),
      content: "this is a test content",
    });

    expect(result.isRight()).toBeTruthy();
    //@ts-ignore
    expect(result.value?.answerComment).toBeInstanceOf(AnswerComment);
    //@ts-ignore
    expect(result.value?.answerComment).toEqual(
      fakeAnswerCommentsRepo.itens[0]
    );
  });
});
