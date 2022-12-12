import service from '~/api/http';
import { User } from '~/types';

const AuthApi = {
  signIn: async (code: string) => service.post<User>('/auth', { code }),
};

export default AuthApi;
