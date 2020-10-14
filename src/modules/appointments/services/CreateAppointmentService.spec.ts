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
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: 'provider',
            user_id: 'user',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider');
    });

    it('should not be able create two appointment on the same time ', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 12).getTime();
        });

        const date = new Date(2020, 4, 20, 13);

        await createAppointmentService.execute({
            date,
            provider_id: 'firstAppointment',
            user_id: 'aipaipara',
        });

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'firstAppointment',
                user_id: 'aipaipara',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on past dates', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 10),
                provider_id: 'firstAppointment',
                user_id: 'aipaipara',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13),
                provider_id: 'sameuser',
                user_id: 'sameuser',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8AM and after 5PM', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 9, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 7),
                provider_id: 'user-id',
                user_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 18),
                provider_id: 'user-id',
                user_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
