import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateUserService from '../service/CreateUserService';
import UpdateUserAvatarService from '../service/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const user_id = request.user.id;
        const avatarFileName = request.file.filename;
        const updateUserAvatarService = new UpdateUserAvatarService();

        const user = await updateUserAvatarService.execute({
            user_id,
            avatarFileName,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
