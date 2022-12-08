import service from '~/api/http';
import { User } from '~/types';

const AuthApi = {
  // 验证登录实例
  postVerification: (params: object) => service.get(`/me`, params),
  signIn: async (code: string) => service.post<User>('/auth', { code }),
};

export default AuthApi;
