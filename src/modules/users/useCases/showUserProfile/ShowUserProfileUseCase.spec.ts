import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("List User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("Should be able to list user", async () => {
    const user = await inMemoryUsersRepository
      .create({
        name: 'Test', email: 'test@test.com',
        password: await hash("1234", 8)
      });

    const userListed = await inMemoryUsersRepository.findById(user.id as string)

    expect(userListed).toHaveProperty('id');
  })
});
