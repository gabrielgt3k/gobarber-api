import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should create a new appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: 'aipaipara',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('aipaipara');
    });
    it('should not be able create two appointment on the same time ', async () => {
        const date = new Date(2020, 4, 17);

        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        await createAppointmentService.execute({
            date,
            provider_id: 'firstAppointment',
        });

        expect(
            createAppointmentService.execute({
                date,
                provider_id: 'firstAppointment',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
