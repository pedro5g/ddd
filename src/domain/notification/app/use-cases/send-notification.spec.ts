import { InMemoryNotificationRepository } from "tests/repository/in-memory-notification-repository";
import { SendNotificationUseCase } from "./send-notification";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";

let fakeNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;
describe("Send Notification Use Case Test", () => {
  beforeEach(() => {
    fakeNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(fakeNotificationRepository);
  });

  it("should be able to create a new Notification", async () => {
    const testId = new UniqueEntityId();
    const result = await sut.execute({
      recipientId: testId.toString(),
      title: "title test",
      content: "content test",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.isLeft()).toBeFalsy();

    expect(fakeNotificationRepository.items[0].recipientId.toString()).toEqual(
      testId.toString()
    );
  });
});
