import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from './GetBalanceError';


let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance User", () => {
  beforeEach(async () => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it("should be able to return list with all operations", async () => {
    const user = await usersRepository.create({
      name: 'test',
      email: 'test@test.com',
      password: 'test123'
    })

    const statementDeposit = await statementsRepository.create({
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statementWithdraw = await statementsRepository.create({
      amount: 50,
      description: "withdraw",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const balance = await getBalanceUseCase.execute(
      { user_id: user.id as string  }
    )

    expect(balance).toStrictEqual({
      statement: [statementDeposit, statementWithdraw],
      balance: 50,
    });
  })

  it("should not be able to get a balance with a non-existent user", async () => {
    expect(async () => {
      await statementsRepository.create({
        amount: 100,
        description: "test",
        type: OperationType.DEPOSIT,
        user_id: "non-existent",
      });

      await getBalanceUseCase.execute({
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

})

