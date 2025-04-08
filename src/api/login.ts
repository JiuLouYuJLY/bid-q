import instance from "../http";

export const getCaptcha = () => {
  return instance({
    url: "/captcha/generate",
    method: "get",
  })
};

export const authLogin = (data: any) => {
  return instance({
    url: "/auth/login",
    method: "post",
    data,
  })
};

export const getEmailCode = (email: string) => {
  return instance({
    url: "/auth/captcha",
    method: "post",
    data: {
      email,
    },
  })
};

export const authRegister = (data: any) => {
  return instance({
    url: "/auth/register",
    method: "post",
    data,
  })
};