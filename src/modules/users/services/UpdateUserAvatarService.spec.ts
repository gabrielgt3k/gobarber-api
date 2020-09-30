import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

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
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatarService.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'profile.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

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
