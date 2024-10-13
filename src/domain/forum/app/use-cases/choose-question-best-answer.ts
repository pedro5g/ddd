import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { QuestionRepository } from "../repositories/questions-repository";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";

export interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

export interface ChooseQuestionBestAnswerUseCaseResponse {
  answer: Answer;
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository
  ) {}
  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    const question = await this.questionRepository.findById(answer.questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.authorId !== authorId) {
      throw new Error("Not allowed");
    }

    question.beastAnswerId = new UniqueEntityId(answer.id);
    await this.questionRepository.update(question);

    return {
      answer,
    };
  }
}
