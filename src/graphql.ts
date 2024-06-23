
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
    id?: Nullable<string>;
    recipe: RecipeInput;
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    isPublic?: Nullable<boolean>;
    touchArray: Nullable<TouchInput>[];
}

export class CreateFirstBuildInput {
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    isPublic?: Nullable<boolean>;
    touchArray: Nullable<TouchInput>[];
}

export class UpdateBuildInput {
    id?: Nullable<string>;
    recipe: RecipeInput;
    buildId: string;
    buildName: string;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    isPublic?: Nullable<boolean>;
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
    parent?: Nullable<string>;
}

export class UpdateIngredientInput {
    id?: Nullable<string>;
    name: string;
    description?: Nullable<string>;
    parent?: Nullable<string>;
}

export class InventoryInput {
    id: string;
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

export class RecipeInput {
    id?: Nullable<string>;
    name: string;
    about?: Nullable<string>;
}

export class UpdateRecipeInput {
    id: string;
    name: string;
    about: string;
    build: UpdateBuildInput;
}

export class CreateStockInput {
    amount: number;
    ingredientName: string;
    price: number;
    unitAbb: string;
    buildName?: Nullable<string>;
    recipeName?: Nullable<string>;
}

export class BuildRefInput {
    id: string;
    buildName?: Nullable<string>;
    recipeName?: Nullable<string>;
}

export class TouchInput {
    id?: Nullable<string>;
    ingredient: UpdateIngredientInput;
    amount: number;
    unit: UnitInput;
    order?: Nullable<number>;
    cost?: Nullable<number>;
}

export class UnitInput {
    id?: Nullable<string>;
    abbreviation: string;
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

export class AuthResponse {
    id: number;
    userId: string;
    authType: string;
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

    abstract findFolloweddUsersBuildPermission(buildId: string): Nullable<Nullable<UserBuildPermission>[]> | Promise<Nullable<Nullable<UserBuildPermission>[]>>;

    abstract findByIngredient(ingredientName?: Nullable<string>): Nullable<Nullable<Build>[]> | Promise<Nullable<Nullable<Build>[]>>;

    abstract costBuild(buildId?: Nullable<string>, inventoryId?: Nullable<string>): Nullable<Cost> | Promise<Nullable<Cost>>;

    abstract ingredients(): Nullable<Ingredient>[] | Promise<Nullable<Ingredient>[]>;

    abstract ingredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract stockList(inventoryId?: Nullable<string>): Nullable<Nullable<Ingredient>[]> | Promise<Nullable<Nullable<Ingredient>[]>>;

    abstract allInventory(): Nullable<Nullable<Inventory>[]> | Promise<Nullable<Nullable<Inventory>[]>>;

    abstract oneInventory(inventoryId?: Nullable<string>): Nullable<Inventory> | Promise<Nullable<Inventory>>;

    abstract userInventory(): Nullable<Nullable<Inventory>[]> | Promise<Nullable<Nullable<Inventory>[]>>;

    abstract getProfile(): Profile | Promise<Profile>;

    abstract findFolloweddUsersBookPermission(recipeBookId: string): Nullable<Nullable<UserBookPermission>[]> | Promise<Nullable<Nullable<UserBookPermission>[]>>;

    abstract publicBook(name?: Nullable<string>): RecipeBook | Promise<RecipeBook>;

    abstract publicBookList(): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract publicBooks(skip?: Nullable<number>, take?: Nullable<number>): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract book(name?: Nullable<string>): Nullable<RecipeBook> | Promise<Nullable<RecipeBook>>;

    abstract userBookList(): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract userBooks(skip?: Nullable<number>, take?: Nullable<number>): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract allBookList(): Nullable<RecipeBook>[] | Promise<Nullable<RecipeBook>[]>;

    abstract publicRecipe(name: string): Recipe | Promise<Recipe>;

    abstract publicRecipeList(): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract publicRecipes(skip?: Nullable<number>, take?: Nullable<number>): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract recipe(name: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;

    abstract userRecipeList(): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract userRecipes(skip?: Nullable<number>, take?: Nullable<number>): Nullable<Recipe>[] | Promise<Nullable<Recipe>[]>;

    abstract findAllStock(): Nullable<Nullable<Stock>[]> | Promise<Nullable<Nullable<Stock>[]>>;

    abstract findManyStocks(inventoryId?: Nullable<string>, skip?: Nullable<number>, take?: Nullable<number>): Nullable<Nullable<Stock>[]> | Promise<Nullable<Nullable<Stock>[]>>;

    abstract findOneStock(ingredientName?: Nullable<string>, inventoryId?: Nullable<string>): Nullable<Stock> | Promise<Nullable<Stock>>;

    abstract costTouchArray(touches?: Nullable<Nullable<TouchInput>[]>, inventoryId?: Nullable<string>): Nullable<Nullable<Touch>[]> | Promise<Nullable<Nullable<Touch>[]>>;

    abstract findAllUnits(): Nullable<Nullable<Unit>[]> | Promise<Nullable<Nullable<Unit>[]>>;

    abstract findSomeUnits(unitType?: Nullable<string>): Nullable<Nullable<Unit>[]> | Promise<Nullable<Nullable<Unit>[]>>;

    abstract convertUnit(amount?: Nullable<number>, unitName?: Nullable<string>, desiredUnitName?: Nullable<string>): Nullable<ConversionResult> | Promise<Nullable<ConversionResult>>;

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

    abstract addPasswordAuth(id?: Nullable<string>, password?: Nullable<string>): AuthResponse | Promise<AuthResponse>;

    abstract addOauthAuth(id?: Nullable<string>, provider?: Nullable<string>, providerUserId?: Nullable<string>, accessToken?: Nullable<string>, tokenExpiry?: Nullable<DateTime>): AuthResponse | Promise<AuthResponse>;

    abstract createBuild(createBuildInput?: Nullable<CreateBuildInput>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract updateBuild(updateBuildInput?: Nullable<UpdateBuildInput>): Nullable<ArchiveResponse> | Promise<Nullable<ArchiveResponse>>;

    abstract updateManyBuilds(updateManyBuildInput: Nullable<UpdateManyBuildInput>[]): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract uploadBook(bookId: string, updateManyBuildInput: Nullable<UpdateBuildInput>[]): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract removeBuild(buildId?: Nullable<string>, permission?: Nullable<Permission>): Nullable<Build> | Promise<Nullable<Build>>;

    abstract changeBuildPermission(changeBuildPermissionInput?: Nullable<ChangeBuildPermissionInput>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract deleteBuildPermission(changeBuildPermissionInput?: Nullable<ChangeBuildPermissionInput>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract createIngredient(createIngredientInput: CreateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract createManyIngredients(createManyIngredientInputs: Nullable<CreateIngredientInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract updateIngredient(updateIngredientInput: UpdateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract removeIngredient(id: string): StatusMessage | Promise<StatusMessage>;

    abstract createInventory(name?: Nullable<string>, description?: Nullable<string>): Nullable<Inventory> | Promise<Nullable<Inventory>>;

    abstract updateProfile(image?: Nullable<string>): Profile | Promise<Profile>;

    abstract createRecipeBook(name: string, description?: Nullable<string>, isPublic?: Nullable<boolean>): RecipeBook | Promise<RecipeBook>;

    abstract updateRecipeBook(id: string, name: string, permission: Permission, description?: Nullable<string>): RecipeBook | Promise<RecipeBook>;

    abstract removeRecipeBook(id: string, permission: Permission): StatusMessage | Promise<StatusMessage>;

    abstract addBuildToRecipeBook(recipeBookId: string, buildId: string, buildPermission: Permission, bookPermission: Permission): Build | Promise<Build>;

    abstract removeBuildFromRecipeBook(recipeBookId: string, buildId: string, bookPermission: Permission): StatusMessage | Promise<StatusMessage>;

    abstract changeRecipeBookPermission(userId: string, recipeBookId: string, userPermission?: Nullable<Permission>, desiredPermission?: Nullable<Permission>): RecipeBookShare | Promise<RecipeBookShare>;

    abstract removeRecipeBookPermission(userId: string, recipeBookId: string, permission?: Nullable<Permission>): StatusMessage | Promise<StatusMessage>;

    abstract createManyRecipes(createManyRecipeInputs: Nullable<CreateRecipeInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract createRecipe(createRecipeInput: CreateRecipeInput): Recipe | Promise<Recipe>;

    abstract updateRecipe(updateRecipeInput: UpdateRecipeInput): Recipe | Promise<Recipe>;

    abstract removeRecipe(id: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;

    abstract createStock(createStock?: Nullable<CreateStockInput>, inventoryId?: Nullable<string>): Nullable<Stock> | Promise<Nullable<Stock>>;

    abstract createManyStocks(createManyStocks?: Nullable<Nullable<CreateStockInput>[]>, inventoryId?: Nullable<string>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract changeStockPermission(stockId?: Nullable<string>, userId?: Nullable<string>, userPermission?: Nullable<Permission>, desiredPermission?: Nullable<Permission>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract removeStockPermission(stockId?: Nullable<string>, userId?: Nullable<string>, userPermission?: Nullable<Permission>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

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
    isPublic?: Nullable<boolean>;
    permission?: Nullable<Permission>;
    touch: Touch[];
    touchWithCost?: Nullable<Nullable<Touch>[]>;
    version?: Nullable<number>;
    archivedBuild?: Nullable<Nullable<ArchivedBuild>[]>;
}

export class BuildConstructor {
    name: string;
    buildName: string;
    about?: Nullable<string>;
    instructions?: Nullable<string>;
    ice?: Nullable<string>;
    image?: Nullable<string>;
    glassware?: Nullable<string>;
    isPublic?: Nullable<boolean>;
    recipe?: Nullable<RecipeName>;
    touchArray: Nullable<CompleteTouch>[];
    id: string;
    permission: Permission;
    newRecipe: boolean;
}

export class RecipeName {
    name?: Nullable<string>;
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

export class Cost {
    cost: number;
}

export class ListItem {
    id: string;
    name: string;
}

export class Ingredient {
    id: string;
    name: string;
    description: string;
    pricePerOunce?: Nullable<number>;
}

export class Inventory {
    id: string;
    name: string;
    description?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    editedAt?: Nullable<DateTime>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    permission?: Nullable<Permission>;
    stock?: Nullable<Nullable<Stock>[]>;
}

export class InventoryUser {
    user?: Nullable<User>;
    inventory?: Nullable<Inventory>;
    permission?: Nullable<Permission>;
}

export class Profile {
    id: string;
    image?: Nullable<string>;
    user?: Nullable<User>;
    preferredBook?: Nullable<RecipeBook>;
    preferredBookName?: Nullable<string>;
    preferredInventory?: Nullable<Inventory>;
    preferredInventoryId?: Nullable<string>;
    recipes?: Nullable<Nullable<Recipe>[]>;
    builds?: Nullable<Nullable<Build>[]>;
    books?: Nullable<Nullable<RecipeBook>[]>;
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
    isPublic?: Nullable<boolean>;
    permission?: Nullable<Permission>;
    userBuild: Build[];
    publicBuild?: Nullable<Nullable<Build>[]>;
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
    publicBuild?: Nullable<Nullable<Build>[]>;
    userBuild?: Nullable<Nullable<Build>[]>;
}

export class Stock {
    price?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<Unit>;
    unitAbb?: Nullable<string>;
    buildRef?: Nullable<Build>;
    ingredient?: Nullable<Ingredient>;
    inventory?: Nullable<Inventory>;
    pricePerOunce?: Nullable<number>;
}

export class Touch {
    id: string;
    build?: Nullable<Build>;
    order: number;
    amount: number;
    unitAbb: string;
    unit: Unit;
    version?: Nullable<number>;
    ingredient: Ingredient;
    ingredientName?: Nullable<string>;
    cost?: Nullable<number>;
}

export class ArchivedTouch {
    id: string;
    archivedBuild?: Nullable<Build>;
    order?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<Unit>;
    unitAbb?: Nullable<string>;
    version?: Nullable<number>;
    ingredient?: Nullable<Ingredient>;
}

export class CompleteTouch {
    id: string;
    ingredient: Ingredient;
    amount: number;
    unit: Unit;
    order?: Nullable<number>;
}

export class Unit {
    id: string;
    abbreviation: string;
    name?: Nullable<string>;
    conversions?: Nullable<number>;
    conversionTo?: Nullable<UnitConversion>;
    conversionFrom?: Nullable<UnitConversion>;
}

export class UnitConversion {
    id: string;
    fromUnit?: Nullable<Unit>;
    toUnit?: Nullable<Unit>;
    factor?: Nullable<number>;
}

export class ConversionResult {
    originalAmount: number;
    convertedAmount: number;
    originalUnit: string;
    convertedUnit: string;
}

export class User {
    id: string;
    userName: string;
    email: EmailAddress;
    dateJoined?: Nullable<DateTime>;
    lastEdited?: Nullable<DateTime>;
    following?: Nullable<Nullable<Following>[]>;
    followedBy?: Nullable<Nullable<Follower>[]>;
    profile?: Nullable<Profile>;
    role?: Nullable<string>;
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
    message: string;
    code?: Nullable<string>;
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
