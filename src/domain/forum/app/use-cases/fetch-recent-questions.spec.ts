import { InMemoryQuestionsRepository } from "tests/repository/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { Question } from "../../enterprise/entities/question";

let fakeRepo: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions Use Case", () => {
  beforeEach(() => {
    fakeRepo = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(fakeRepo);
  });

  it("Should be able to return questions ordered to recent date", async () => {
    const testDatas: Question[] = [
      makeQuestion({ createdAt: new Date(2024, 8, 20) }),
      makeQuestion({ createdAt: new Date(2024, 8, 21) }),
      makeQuestion({ createdAt: new Date(2024, 8, 22) }),
    ];

    testDatas.forEach(async (i) => {
      await fakeRepo.create(i);
    });

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toHaveLength(3);
    expect(result.value?.questions).toEqual([
      testDatas[2],
      testDatas[1],
      testDatas[0],
    ]);
  });

  it("Should be able to paginate the recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await fakeRepo.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toHaveLength(2);
  });
});
