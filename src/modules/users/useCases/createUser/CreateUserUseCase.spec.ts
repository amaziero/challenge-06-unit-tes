import "reflect-metadata"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from './CreateUserError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe(("User"), () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })
  it("should be able to create a new user", async () => {
    const createUser = { name: 'Test', email: 'test@test.com', password: 'test' }

    const user = await createUserUseCase.execute(createUser);

    expect(user).toHaveProperty("id")
  })

  it("should not be able to create a duplicate user", async () => {
    const createUser = { name: 'Test', email: 'test@test.com', password: 'test' }

    await createUserUseCase.execute(createUser);

    expect(async () => {
      await createUserUseCase.execute(createUser);
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
