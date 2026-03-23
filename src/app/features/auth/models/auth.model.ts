export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
