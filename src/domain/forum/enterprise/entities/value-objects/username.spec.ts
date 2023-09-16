import { Username } from './username';

describe('Author username value object', () => {
  it('should be able to create a valid username', () => {
    const usernameOrError = Username.create('johndoe');

    expect(usernameOrError.isRight()).toBeTruthy();
  });

  it('should not be able create an invalid username', () => {
    const usernameOrError1 = Username.create('jo');
    const usernameOrError2 = Username.create('johndoe@example');
    const usernameOrError3 = Username.create('@example.com');
    const usernameOrError4 = Username.create('johndoe@example.');

    expect(usernameOrError1.isLeft()).toBeTruthy();
    expect(usernameOrError2.isLeft()).toBeTruthy();
    expect(usernameOrError3.isLeft()).toBeTruthy();
    expect(usernameOrError4.isLeft()).toBeTruthy();
  });
});
