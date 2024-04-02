
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Relationship {
    Favorite = "Favorite",
    Close = "Close",
    Following = "Following",
    Blocked = "Blocked"
}

export class CreateUserInput {
    userName: string;
    email: EmailAddress;
    password: string;
}

export class LoginInput {
    email: EmailAddress;
    password: string;
}

export class CreateIngredientInput {
    name: string;
    description?: Nullable<string>;
}

export class UpdateIngredientInput {
    id: string;
    name: string;
    description?: Nullable<string>;
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

    abstract ingredients(): Nullable<Ingredient>[] | Promise<Nullable<Ingredient>[]>;

    abstract ingredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract allUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract userById(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract signup(createUserInput: CreateUserInput): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract logout(userId: string): Nullable<LogoutResponse> | Promise<Nullable<LogoutResponse>>;

    abstract getNewTokens(userId?: Nullable<string>, refreshToken?: Nullable<string>): Nullable<NewTokenResponse> | Promise<Nullable<NewTokenResponse>>;

    abstract createIngredient(createIngredientInput: CreateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract updateIngredient(updateIngredientInput: UpdateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract removeIngredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract followUser(followId: string, relationship?: Nullable<Relationship>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unFollowUser(unfollowId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract blockUser(blockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unblockUser(unblockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;
}

export class Ingredient {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class User {
    id: string;
    userName: string;
    email: EmailAddress;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    following?: Nullable<Nullable<Following>[]>;
    followedBy?: Nullable<Nullable<Follower>[]>;
}

export class Following {
    id: string;
    userName: string;
    email: EmailAddress;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    relationship?: Nullable<Relationship>;
}

export class Follower {
    id: string;
    userName: string;
    email: EmailAddress;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
}

export class StatusMessage {
    message?: Nullable<string>;
}

export class FollowReturn {
    following?: Nullable<string>;
    relationship?: Nullable<Relationship>;
    status?: Nullable<StatusMessage>;
}

export type DateTime = any;
export type EmailAddress = any;
type Nullable<T> = T | null;
