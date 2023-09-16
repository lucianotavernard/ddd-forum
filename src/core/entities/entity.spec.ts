import { Entity } from './entity';
import { UniqueEntityID } from './unique-entity-id';

type CustomEntityProps = {
  name: string;
};

class CustomEntity extends Entity<CustomEntityProps> {
  static create(props: CustomEntityProps, id?: UniqueEntityID) {
    return new CustomEntity(props, id);
  }
}

describe('Core Entity', () => {
  it('should generate an ID if not provided', () => {
    const entity = CustomEntity.create({ name: 'custom-entity' });

    expect(entity.id).toBeTruthy();
  });

  it('should use the provided ID if provided', () => {
    const entity = CustomEntity.create(
      { name: 'custom-entity' },
      new UniqueEntityID('custom-id'),
    );

    expect(entity.id.equals(new UniqueEntityID('custom-id'))).toEqual(true);
  });

  it('should be able to check equality', () => {
    const entityOne = CustomEntity.create(
      { name: 'custom-entity-one' },
      new UniqueEntityID('same-id'),
    );
    const entityTwo = CustomEntity.create(
      { name: 'custom-entity-two' },
      new UniqueEntityID('same-id'),
    );

    class Another {}

    expect(entityOne.equals(entityOne)).toBe(true);

    expect(entityOne.equals(new Another() as any)).toBe(false);
    expect(entityOne.equals(entityTwo)).toBe(false);
  });
});
