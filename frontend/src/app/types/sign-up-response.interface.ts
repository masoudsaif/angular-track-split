import IUser from './user.interface';

export default interface ISignUpResponse {
  user: IUser;
  token: string;
}
