import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update user avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'profile.png',
        });

        expect(user.avatar).toBe('profile.png');
    });
    it('should not be able to update avatar from a non existing user', async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'profile.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'profile.png',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'profile2.png',
        });

        expect(deleteFile).toHaveBeenCalledWith('profile.png');
        expect(user.avatar).toBe('profile2.png');
    });
});
