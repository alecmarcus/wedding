import { Login as LoginComponent } from "@@/components/Login";

export const Login = () => (
  <LoginComponent automatic={true} redirect="/upload/admin" />
);
