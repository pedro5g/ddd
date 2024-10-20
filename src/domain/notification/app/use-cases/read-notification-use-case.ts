import { Either, left, right } from "@/core/__error/either";
import { NotificationRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/domain/forum/app/use-cases/__errors/resource-not-found-error";
import { NotAllowedError } from "@/domain/forum/app/use-cases/__errors/not-allowed-error";

export interface ReadNotificationUseCaseRequest {
  notificationId: string;
  recipientId: string;
}
export type ReadNotificationUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationRepository.save(notification);

    return right({});
  }
}
