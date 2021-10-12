import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authUserUseCase: AuthenticateUserUseCase;

describe(("Auth user"), () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })
  it("should be able to auth user", async () => {
    await inMemoryUsersRepository
      .create({
        name: 'Test', email: 'test@test.com',
        password: await hash("1234", 8)
      });

    const userAuth = await authUserUseCase.execute({ email: 'test@test.com', password: '1234' })

    expect(userAuth).toHaveProperty('token')
  })

  it("should not be able to auth non created user", async () => {
    expect(async () => {
      await authUserUseCase.execute({ email: 'test@test.com', password: '1234' })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to auth user with wrong pass", async () => {
    await inMemoryUsersRepository
      .create({
        name: 'Test', email: 'test@test.com',
        password: await hash("1234", 8)
      });

    expect(async () => {
      await authUserUseCase.execute({ email: 'test@test.com', password: 'test' })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
