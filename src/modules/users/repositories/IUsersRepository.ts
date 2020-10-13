import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
    findAllProviders(data: IFindProvidersDTO): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(date: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}
