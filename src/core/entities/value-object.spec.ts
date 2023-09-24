import { ValueObject } from './value-object';

type CustomValueObjectProps = {
  name: string;
};

class CustomValueObject extends ValueObject<CustomValueObjectProps> {
  get name() {
    return this.props.name;
  }

  static create(props: CustomValueObjectProps) {
    return new CustomValueObject(props);
  }
}

describe('Core Value Object', () => {
  it('should generate an ID if not provided', () => {
    const vo = CustomValueObject.create({ name: 'custom-entity' });

    expect(vo.name).toBeTruthy();
  });

  it('should be able to check equality', () => {
    const voOne = CustomValueObject.create({ name: 'custom-vo-one' });
    const voTwo = CustomValueObject.create({ name: 'custom-vo-two' });

    class Another {}

    expect(voOne.equals(voOne)).toBe(true);
    expect(voOne.equals(null)).toBe(false);
    expect(voOne.equals(undefined)).toBe(false);
    expect(voOne.equals(new Another() as any)).toBe(false);
    expect(voOne.equals(voTwo)).toBe(false);
  });
});
