import service from '~/api/http';
import { User } from '~/types';

const AuthApi = {
  signIn: async (code: string) => service.post<User>('/auth', { code }),
  logout: async () => service.post('/auth/logout'),
};

export default AuthApi;
