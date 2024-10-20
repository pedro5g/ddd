import { InMemoryNotificationRepository } from "tests/repository/in-memory-notification-repository";
import { ReadNotificationUseCase } from "./read-notification-use-case";
import { Notification } from "../../enterprise/entities/notification";
import { makeNotification } from "tests/factories/make-notification";
import { NotAllowedError } from "@/domain/forum/app/use-cases/__errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/app/use-cases/__errors/resource-not-found-error";

let testNotification: Notification;
let fakeNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification Use Case Test", () => {
  beforeEach(() => {
    fakeNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(fakeNotificationRepository);
    testNotification = makeNotification();
  });
  it("should be able to read a new Notification", async () => {
    await fakeNotificationRepository.create(testNotification);
    const spyRead = vitest.spyOn(testNotification, "read");

    const result = await sut.execute({
      recipientId: testNotification.recipientId.toString(),
      notificationId: testNotification.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(spyRead).toBeCalledTimes(1);
    expect(fakeNotificationRepository.items[0].readAt).not.toBeUndefined();
  });

  it("should not be able to read a notification that don't exists", async () => {
    const result = await sut.execute({
      recipientId: testNotification.recipientId.toString(),
      notificationId: testNotification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to read a notification another user", async () => {
    await fakeNotificationRepository.create(testNotification);

    const result = await sut.execute({
      recipientId: "fake-recipient-id",
      notificationId: testNotification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
