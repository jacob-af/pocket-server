
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

export enum Permission {
    BLOCKED = "BLOCKED",
    VIEW = "VIEW",
    EDIT = "EDIT",
    MANAGER = "MANAGER",
    OWNER = "OWNER"
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
    recipe: RecipeNameInput;
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
}

export class RecipeNameInput {
    name: string;
}

export class CreateFirstBuildInput {
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
}

export class UpdateBuildInput {
    recipe: RecipeNameInput;
    buildId: string;
    buildName?: Nullable<string>;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
    permission?: Nullable<Permission>;
}

export class UpdateManyBuildInput {
    name: string;
    about?: Nullable<string>;
    build: ManyBuildInput;
}

export class ManyBuildInput {
    buildId?: Nullable<string>;
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray: Nullable<TouchInput>[];
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

export class ProfileInput {
    userId: string;
    image?: Nullable<string>;
}

export class CreateRecipeInput {
    recipeName: string;
    about: string;
    build: CreateFirstBuildInput;
}

export class UpdateRecipeInput {
    id: string;
    name: string;
    about: string;
    build: UpdateBuildInput;
}

export class TouchInput {
    id: string;
    ingredientName: string;
    amount: number;
    unit: string;
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

    abstract findOneBuild(recipeName: string, buildName: string): Nullable<Build> | Promise<Nullable<Build>>;

    abstract usersBuilds(): Nullable<Nullable<Build>[]> | Promise<Nullable<Nullable<Build>[]>>;

    abstract findBuildUsers(buildId: string): Nullable<Nullable<BuildUser>[]> | Promise<Nullable<Nullable<BuildUser>[]>>;

    abstract findFolloweddUsersBuildPermission(buildId: string): Nullable<Nullable<UserBuildPermission>[]> | Promise<Nullable<Nullable<UserBuildPermission>[]>>;

    abstract ingredients(): Nullable<Ingredient>[] | Promise<Nullable<Ingredient>[]>;

    abstract ingredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract getProfile(userId?: Nullable<string>): Profile | Promise<Profile>;

    abstract allRecipeBooks(): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract userRecipeBooks(): Nullable<Nullable<RecipeBook>[]> | Promise<Nullable<Nullable<RecipeBook>[]>>;

    abstract recipeBook(name?: Nullable<string>): Nullable<RecipeBook> | Promise<Nullable<RecipeBook>>;

    abstract findFolloweddUsersBookPermission(recipeBookId: string): Nullable<Nullable<UserBookPermission>[]> | Promise<Nullable<Nullable<UserBookPermission>[]>>;

    abstract recipeList(): Nullable<ListItem>[] | Promise<Nullable<ListItem>[]>;

    abstract recipes(): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract recipe(name: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;

    abstract userRecipe(): Nullable<Nullable<Recipe>[]> | Promise<Nullable<Nullable<Recipe>[]>>;

    abstract allUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract userById(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract findFollows(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract findFollowers(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract getUserRelationships(): Nullable<Nullable<UserRelation>[]> | Promise<Nullable<Nullable<UserRelation>[]>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract signin(loginInput: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract googleSignIn(googleUserId: string, email: string, name: string, accessToken: string, tokenExpiry: DateTime, image?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract signup(createUserInput: CreateUserInput): AuthPayload | Promise<AuthPayload>;

    abstract logout(userId: string): LogoutResponse | Promise<LogoutResponse>;

    abstract getNewTokens(refreshToken?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract createNewUser(email?: Nullable<string>, userName?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract addPasswordAuth(id?: Nullable<string>, password?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract addOauthAuth(id?: Nullable<string>, provider?: Nullable<string>, providerUserId?: Nullable<string>, accessToken?: Nullable<string>, tokenExpiry?: Nullable<DateTime>): AuthPayload | Promise<AuthPayload>;

    abstract createBuild(createBuildInput?: Nullable<CreateBuildInput>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract updateBuild(updateBuildInput?: Nullable<UpdateBuildInput>): Nullable<ArchiveResponse> | Promise<Nullable<ArchiveResponse>>;

    abstract updateManyBuilds(updateManyBuildInput: Nullable<UpdateManyBuildInput>[]): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract removeBuild(buildId?: Nullable<string>, permission?: Nullable<Permission>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract changeBuildPermission(changeBuildPermissionInput?: Nullable<ChangeBuildPermissionInput>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract deleteBuildPermission(changeBuildPermissionInput?: Nullable<ChangeBuildPermissionInput>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract createIngredient(createIngredientInput: CreateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract createManyIngredients(createManyIngredientInputs: Nullable<CreateIngredientInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract updateIngredient(updateIngredientInput: UpdateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract removeIngredient(id: string): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract updateProfile(image?: Nullable<string>): Profile | Promise<Profile>;

    abstract createRecipeBook(name: string, description?: Nullable<string>): RecipeBook | Promise<RecipeBook>;

    abstract updateRecipeBook(id: string, name: string, permission: Permission, description?: Nullable<string>): RecipeBook | Promise<RecipeBook>;

    abstract removeRecipeBook(id: string, permission: Permission): StatusMessage | Promise<StatusMessage>;

    abstract addBuildToRecipeBook(recipeBookId: string, buildId: string, buildPermission: Permission, bookPermission: Permission): StatusMessage | Promise<StatusMessage>;

    abstract removeBuildFromRecipeBook(recipeBookId: string, buildId: string, bookPermission: Permission): StatusMessage | Promise<StatusMessage>;

    abstract changeRecipeBookPermission(userId: string, recipeBookId: string, userPermission?: Nullable<Permission>, desiredPermission?: Nullable<Permission>): RecipeBookShare | Promise<RecipeBookShare>;

    abstract removeRecipeBookPermission(userId: string, recipeBookId: string, permission?: Nullable<Permission>): StatusMessage | Promise<StatusMessage>;

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

export class NewUser {
    id: number;
    email: string;
    name?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Build {
    id: string;
    recipe: Recipe;
    buildName: string;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    createdById?: Nullable<string>;
    editedBy?: Nullable<User>;
    instructions?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    permission?: Nullable<Permission>;
    touch: Touch[];
    version?: Nullable<number>;
    archivedBuild?: Nullable<Nullable<ArchivedBuild>[]>;
}

export class BuildConstructor {
    name: string;
    buildName: string;
    about?: Nullable<string>;
    instructions?: Nullable<string>;
    ice?: Nullable<string>;
    glassware?: Nullable<string>;
    touchArray: Nullable<CompleteTouch>[];
    id: string;
    permission: Permission;
    newRecipe: boolean;
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

export class UserBuildPermission {
    user: User;
    permission?: Nullable<string>;
}

export class ArchiveResponse {
    build?: Nullable<Build>;
    archivedBuild?: Nullable<ArchivedBuild>;
}

export class BuildPermissionResponse {
    buildUser?: Nullable<BuildUser>;
    status?: Nullable<StatusMessage>;
}

export class ListItem {
    id: string;
    name: string;
}

export class Ingredient {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class Profile {
    id: string;
    image?: Nullable<string>;
    user?: Nullable<User>;
}

export class RecipeBook {
    id: string;
    name: string;
    description: string;
    createdAt?: Nullable<DateTime>;
    createdById?: Nullable<string>;
    editedAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    permission?: Nullable<Permission>;
    build: Build[];
}

export class RecipeBookUser {
    recipeBook: RecipeBook;
    user: User;
    permission: Permission;
}

export class RecipeBookShare {
    recipeBook?: Nullable<RecipeBookUser>;
    status?: Nullable<StatusMessage>;
}

export class UserBookPermission {
    user: User;
    permission?: Nullable<string>;
}

export class Recipe {
    id: string;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    name: string;
    about?: Nullable<string>;
    createdBy?: Nullable<User>;
    createdById?: Nullable<string>;
    editedBy?: Nullable<User>;
    editeById?: Nullable<string>;
    build?: Nullable<Nullable<Build>[]>;
    userBuild: Build[];
}

export class Touch {
    id: string;
    build?: Nullable<Build>;
    order: number;
    amount: number;
    unit: string;
    version?: Nullable<number>;
    ingredient: Ingredient;
    ingredientName?: Nullable<string>;
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
    ingredientName: string;
    amount: number;
    unit: string;
}

export class User {
    id: string;
    userName: string;
    email?: Nullable<EmailAddress>;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    following?: Nullable<Nullable<Following>[]>;
    followedBy?: Nullable<Nullable<Follower>[]>;
    myBuild?: Nullable<Nullable<Build>[]>;
    allBuilds?: Nullable<Nullable<Build>[]>;
    buildEditedBy?: Nullable<Nullable<Build>[]>;
    profile?: Nullable<Profile>;
}

export class Following {
    id: string;
    userName: string;
    email?: Nullable<EmailAddress>;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    relationship?: Nullable<Relationship>;
}

export class Follower {
    id: string;
    userName: string;
    email?: Nullable<EmailAddress>;
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

export class UserRelation {
    id: string;
    userName: string;
    followedBy: boolean;
    following: boolean;
}

export type DateTime = any;
export type EmailAddress = any;
type Nullable<T> = T | null;
