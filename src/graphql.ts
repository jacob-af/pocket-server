/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
  userName: string;
  email: EmailAddress;
  password: string;
}

export class LoginInput {
  email: EmailAddress;
  password: string;
}

export class UpdateUserInput {
  id: string;
  userName?: Nullable<string>;
  email?: Nullable<string>;
}

export class AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export class LogoutResponse {
  loggedOut: boolean;
}

export class NewTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class IQuery {
  abstract hello(): string | Promise<string>;

  abstract allUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

  abstract userById(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
  abstract login(
    loginInput: LoginInput,
  ): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

  abstract signup(
    createUserInput: CreateUserInput,
  ): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

  abstract logout(
    userId: string,
  ): Nullable<LogoutResponse> | Promise<Nullable<LogoutResponse>>;

  abstract getNewTokens(
    userId?: Nullable<string>,
    refreshToken?: Nullable<string>,
  ): Nullable<NewTokenResponse> | Promise<Nullable<NewTokenResponse>>;
}

export class User {
  id: string;
  userName: string;
  email: EmailAddress;
}

export type DateTime = any;
export type EmailAddress = any;
type Nullable<T> = T | null;
