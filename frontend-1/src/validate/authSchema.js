import * as yup from "yup";

const authSchema = {
  register: yup.object({
    username: yup.string().required("username is required"),
    email: yup.string().required("email is required"),
    password: yup.string().required("password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "password is not match")
      .required("confirm password is required"),
  }),
  login: yup.object({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
  }),
};

export default authSchema;
