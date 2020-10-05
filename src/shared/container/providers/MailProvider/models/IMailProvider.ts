import IParseMailTemplateDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
    sendMail(data: IParseMailTemplateDTO): Promise<void>;
}
