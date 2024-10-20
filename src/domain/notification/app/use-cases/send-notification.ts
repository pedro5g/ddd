import { Either, right } from "@/core/__error/either";
import { Notification } from "../../enterprise/entities/notification";
import { UniqueEntityId } from "@/core/domain/value-objects/unique-entity-id";
import { NotificationRepository } from "../repositories/notification-repository";

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}
export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({ notification: notification });
  }
}
