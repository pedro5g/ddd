import { AnswerQuestionUseCase } from './answer-question'
import { AnswerRepository } from '../repositories/answer-repository'

const fakeAnswersRepository: AnswerRepository = {
  async create(answer) {},
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const contentTest = {
    questionId: '1232',
    instructorId: '343',
    content: 'this is a test message',
  }

  const answer = await answerQuestion.execute(contentTest)

  expect(answer.content).toEqual(contentTest.content)
})
