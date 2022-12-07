import service from '@/api/http';

const loginApi = {
  // 验证登录实例
  postVerification: (params: object) => service.get(`/me`, params),
};

export default loginApi;
