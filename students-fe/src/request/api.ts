import service from "./index";

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserSignUpData {
  username: string;
  password: string;
  email: string;
}

export interface UploadPhotosData {
  file: any;
}

export interface ListPhotosParam {
  category?: string;
  tag?: string;
  keyword?: string;
  size?: number;
  page?: number;
}

export const apiGetUserInfo = () => {
  return service.post("/user/info");
};

export const apiUserLogin = (data: UserLoginData) => {
  return service.post("/user/login", data);
};

export const apiUserSignUp = (data: UserSignUpData) => {
  return service.post("/user/signup", data);
};

export const apiUploadPhotos = (data: UploadPhotosData) => {
  return service.post("/uploads/photo", data);
};

export const apiListPhotos = (params: ListPhotosParam) => {
  return service.get("/photos", {
    params,
  });
};

export const apiListHomeSlides = () => {
  return service.get("home/slides", {});
};
