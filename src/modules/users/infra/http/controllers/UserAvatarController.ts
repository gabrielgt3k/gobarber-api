import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const avatarFileName = request.file.filename;
        const updateUserAvatarService = container.resolve(
            UpdateUserAvatarService,
        );

        const user = await updateUserAvatarService.execute({
            user_id,
            avatarFileName,
        });

        delete user.password;

        return response.json(user);
    }
}

export default UserAvatarController;
