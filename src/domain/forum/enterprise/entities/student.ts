import { Entity } from 'src/core/domain/entities/entity'
import { UniqueEntityId } from 'src/core/domain/value-objects/unique-entity-id'

export interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  public static create(props: StudentProps, id?: UniqueEntityId) {
    return new Student(props, id)
  }

  get name(): string {
    return this.props.name
  }
}
