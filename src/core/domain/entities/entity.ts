import { UniqueEntityId } from '../value-objects/unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: T
  protected constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id(): string {
    return this._id.value
  }
}
