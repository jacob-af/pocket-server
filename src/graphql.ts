
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Permission {
    VIEW = "VIEW",
    EDIT = "EDIT",
    MANAGER = "MANAGER",
    OWNER = "OWNER",
    BLOCKED = "BLOCKED"
}

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

export class CreateBuildInput {
    recipeId: string;
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
}

export class CreateFirstBuildInput {
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
}

export class UpdateBuildInput {
    recipeId: string;
    buildId: string;
    buildName?: Nullable<string>;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
    permission?: Nullable<Permission>;
}

export class ChangeBuildPermissionInput {
    userId?: Nullable<string>;
    buildId?: Nullable<string>;
    userPermission?: Nullable<Permission>;
    desiredPermission?: Nullable<Permission>;
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

export class CreateRecipeInput {
    name: string;
    about: string;
    build: CreateFirstBuildInput;
}

export class UpdateRecipeInput {
    id: string;
    name?: Nullable<string>;
    about?: Nullable<string>;
}

export class TouchInput {
    ingredientName?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
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

    abstract findAllBuilds(): Nullable<Nullable<Build>[]> | Promise<Nullable<Nullable<Build>[]>>;

    abstract findOneBuild(): Nullable<Build> | Promise<Nullable<Build>>;

    abstract usersBuilds(): Nullable<Nullable<Recipe>[]> | Promise<Nullable<Nullable<Recipe>[]>>;

    abstract ingredients(): Nullable<Ingredient>[] | Promise<Nullable<Ingredient>[]>;

    abstract ingredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract recipes(): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract recipe(id: number): Nullable<Recipe> | Promise<Nullable<Recipe>>;

    abstract allUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract userById(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract signup(createUserInput: CreateUserInput): AuthPayload | Promise<AuthPayload>;

    abstract logout(userId: string): LogoutResponse | Promise<LogoutResponse>;

    abstract getNewTokens(refreshToken?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract createBuild(createBuildInput?: Nullable<CreateBuildInput>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract updateBuild(updateBuildInput?: Nullable<UpdateBuildInput>): Nullable<ArchiveResponse> | Promise<Nullable<ArchiveResponse>>;

    abstract removeBuild(buildId?: Nullable<string>, permission?: Nullable<Permission>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract changeBuildPermission(userId?: Nullable<string>, buildId?: Nullable<string>, userPermission?: Nullable<Permission>, desiredPermission?: Nullable<Permission>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract deleteBuildPermission(userId?: Nullable<string>, buildId?: Nullable<string>, userPermission?: Nullable<Permission>, permission?: Nullable<Permission>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract createIngredient(createIngredientInput: CreateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract createManyIngredients(createManyIngredientInputs: Nullable<CreateIngredientInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract updateIngredient(updateIngredientInput: UpdateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract removeIngredient(id: string): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract createManyRecipes(createManyRecipeInputs: Nullable<CreateRecipeInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract createRecipe(createRecipeInput: CreateRecipeInput): Recipe | Promise<Recipe>;

    abstract updateRecipe(updateRecipeInput: UpdateRecipeInput): Recipe | Promise<Recipe>;

    abstract removeRecipe(id: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;

    abstract updateTouch(newTouchArray?: Nullable<Nullable<TouchInput>[]>, permission?: Nullable<Permission>, buildId?: Nullable<string>, version?: Nullable<number>): Nullable<Nullable<Touch>[]> | Promise<Nullable<Nullable<Touch>[]>>;

    abstract followUser(followId: string, relationship?: Nullable<Relationship>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unFollowUser(unfollowId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract blockUser(blockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unblockUser(unblockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;
}

export class Build {
    id: string;
    recipe: Recipe;
    buildName: string;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    instructions?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    permission?: Nullable<Permission>;
    touch: Nullable<Touch>[];
    version?: Nullable<number>;
    archivedBuild?: Nullable<Nullable<ArchivedBuild>[]>;
}

export class ArchivedBuild {
    id: string;
    buildId: string;
    buildName: string;
    createdAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    instructions?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    version?: Nullable<number>;
    archivedTouch?: Nullable<Nullable<ArchivedTouch>[]>;
}

export class BuildUser {
    user: User;
    build: Build;
    permission?: Nullable<Permission>;
}

export class CompleteBuild {
    id: string;
    buildName: string;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    about?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    instructions?: Nullable<string>;
    permission?: Nullable<Permission>;
    completeTouch?: Nullable<Nullable<CompleteTouch>[]>;
}

export class ArchiveResponse {
    build?: Nullable<Build>;
    archivedBuild?: Nullable<ArchivedBuild>;
}

export class BuildPermissionResponse {
    buildUser?: Nullable<BuildUser>;
    permission?: Nullable<Permission>;
}

export class Ingredient {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class Recipe {
    id: string;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    name?: Nullable<string>;
    about?: Nullable<string>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    build?: Nullable<Nullable<Build>[]>;
}

export class Touch {
    id: string;
    build?: Nullable<Build>;
    order?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    version?: Nullable<number>;
    ingredient?: Nullable<Ingredient>;
}

export class ArchivedTouch {
    id: string;
    archivedBuild?: Nullable<Build>;
    order?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    version?: Nullable<number>;
    ingredient?: Nullable<Ingredient>;
}

export class CompleteTouch {
    id: string;
    ingredientName?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    cost?: Nullable<number>;
}

export class User {
    id: string;
    userName: string;
    email: EmailAddress;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    following?: Nullable<Nullable<Following>[]>;
    followedBy?: Nullable<Nullable<Follower>[]>;
    myBuild?: Nullable<Nullable<Build>[]>;
    allBuilds?: Nullable<Nullable<Build>[]>;
    buildEditedBy?: Nullable<Nullable<Build>[]>;
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
