import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );
    });

    it('should create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: 'aipaipara',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('aipaipara');
    });
    it('should not be able create two appointment on the same time ', async () => {
        const date = new Date(2020, 4, 17);

        await createAppointmentService.execute({
            date,
            provider_id: 'firstAppointment',
        });

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'firstAppointment',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
