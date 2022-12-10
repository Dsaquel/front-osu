import service from '~/api/http';
import { UserToken } from '~/types';

const AuthApi = {
  // 验证登录实例
  postVerification: (params: object) => service.get(`/me`, params),
  signIn: async (code: string) => service.post<UserToken>('/auth', { code }),
};

export default AuthApi;
