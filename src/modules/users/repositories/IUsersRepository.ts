import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(date: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}
