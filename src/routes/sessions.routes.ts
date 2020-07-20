import { Router } from 'express';
import AuthenticadeUserService from '../service/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const authenticadeUserService = new AuthenticadeUserService();

    const { user, token } = await authenticadeUserService.execute({
        email,
        password,
    });

    delete user.password;

    return response.json({ user, token });
});

export default sessionsRouter;
