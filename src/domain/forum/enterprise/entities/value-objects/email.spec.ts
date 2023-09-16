import { Email } from './email';

describe('Author email value object', () => {
  it('should be able to create a valid email address', () => {
    const emailOrError = Email.create('johndoe@example.com');

    expect(emailOrError.isRight()).toBeTruthy();
  });

  it('should not be able create an invalid email address', () => {
    const emailOrError1 = Email.create('johndoe');
    const emailOrError2 = Email.create('johndoe@example');
    const emailOrError3 = Email.create('@example.com');
    const emailOrError4 = Email.create('johndoe@example.');

    expect(emailOrError1.isLeft()).toBeTruthy();
    expect(emailOrError2.isLeft()).toBeTruthy();
    expect(emailOrError3.isLeft()).toBeTruthy();
    expect(emailOrError4.isLeft()).toBeTruthy();
  });
});
