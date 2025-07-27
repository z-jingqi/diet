// @ts-nocheck
import type { GraphQLClient } from 'graphql-request';
import type { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  role?: Maybe<MessageRole>;
  status?: Maybe<MessageStatus>;
  type?: Maybe<MessageType>;
};

export type ChatResponse = {
  __typename?: 'ChatResponse';
  response?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
};

export type ChatSession = {
  __typename?: 'ChatSession';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  messages?: Maybe<Array<ChatMessage>>;
  tagIds?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

/** 菜系类型，用于区分不同风味的食谱 */
export enum CuisineType {
  /** 中餐 / 中国菜 */
  Chinese = 'CHINESE',
  /** 法餐 */
  French = 'FRENCH',
  /** 印度菜 */
  Indian = 'INDIAN',
  /** 意大利菜 */
  Italian = 'ITALIAN',
  /** 日餐 / 日本菜 */
  Japanese = 'JAPANESE',
  /** 韩餐 / 韩国菜 */
  Korean = 'KOREAN',
  /** 墨西哥菜 */
  Mexican = 'MEXICAN',
  /** 其他或未分类 */
  Other = 'OTHER',
  /** 泰国菜 */
  Thai = 'THAI',
  /** 西餐（泛指欧美等西方菜系） */
  Western = 'WESTERN'
}

export enum Difficulty {
  Easy = 'EASY',
  Hard = 'HARD',
  Medium = 'MEDIUM'
}

export type LoginResponse = {
  __typename?: 'LoginResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

/** 用餐场景 / 餐次类型 */
export enum MealType {
  /** 早餐 */
  Breakfast = 'BREAKFAST',
  /** 甜点 */
  Dessert = 'DESSERT',
  /** 晚餐 */
  Dinner = 'DINNER',
  /** 饮品 */
  Drink = 'DRINK',
  /** 午餐 */
  Lunch = 'LUNCH',
  /** 其他场景 */
  Other = 'OTHER',
  /** 加餐 / 零食 */
  Snack = 'SNACK'
}

export enum MessageRole {
  Assistant = 'assistant',
  System = 'system',
  User = 'user'
}

export enum MessageStatus {
  Abort = 'ABORT',
  Done = 'DONE',
  Error = 'ERROR',
  Pending = 'PENDING',
  Streaming = 'STREAMING'
}

export enum MessageType {
  Chat = 'CHAT',
  HealthAdvice = 'HEALTH_ADVICE',
  Recipe = 'RECIPE'
}

export type Mutation = {
  __typename?: 'Mutation';
  createChatSession?: Maybe<ChatSession>;
  createOAuthAccount?: Maybe<OAuthAccount>;
  createRecipe?: Maybe<Recipe>;
  createTag?: Maybe<Tag>;
  createTagCategory?: Maybe<TagCategory>;
  createTagConflict?: Maybe<TagConflict>;
  createUser?: Maybe<User>;
  createUserSession?: Maybe<UserSession>;
  deleteChatSession?: Maybe<Scalars['Boolean']['output']>;
  deleteRecipe?: Maybe<Scalars['Boolean']['output']>;
  deleteRecipes?: Maybe<Scalars['Boolean']['output']>;
  deleteTag?: Maybe<Scalars['Boolean']['output']>;
  deleteTagCategory?: Maybe<Scalars['Boolean']['output']>;
  deleteTagConflict?: Maybe<Scalars['Boolean']['output']>;
  deleteUserSession?: Maybe<Scalars['Boolean']['output']>;
  generateRecipe?: Maybe<Recipe>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  refreshSession?: Maybe<RefreshResponse>;
  register?: Maybe<LoginResponse>;
  removeRecipePreference?: Maybe<Scalars['Boolean']['output']>;
  setRecipePreference?: Maybe<RecipePreference>;
  updateChatSession?: Maybe<ChatSession>;
  updateRecipe?: Maybe<Recipe>;
  updateTag?: Maybe<Tag>;
  updateTagCategory?: Maybe<TagCategory>;
  updateUser?: Maybe<User>;
  wechatLogin?: Maybe<LoginResponse>;
};


export type MutationCreateChatSessionArgs = {
  messages: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  title: Scalars['String']['input'];
};


export type MutationCreateOAuthAccountArgs = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
  providerUserData?: InputMaybe<Scalars['String']['input']>;
  providerUserId: Scalars['String']['input'];
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationCreateRecipeArgs = {
  input: RecipeInput;
};


export type MutationCreateTagArgs = {
  aiPrompt?: InputMaybe<Scalars['String']['input']>;
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  restrictions?: InputMaybe<Array<Scalars['String']['input']>>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateTagCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateTagConflictArgs = {
  conflictType: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  tagId1: Scalars['ID']['input'];
  tagId2: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};


export type MutationCreateUserSessionArgs = {
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  refreshExpiresAt: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
  sessionExpiresAt: Scalars['String']['input'];
  sessionToken: Scalars['String']['input'];
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationDeleteChatSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecipesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagConflictArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserSessionArgs = {
  sessionToken: Scalars['String']['input'];
};


export type MutationGenerateRecipeArgs = {
  input: RecipeGenerateInput;
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRefreshSessionArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRemoveRecipePreferenceArgs = {
  recipeId: Scalars['ID']['input'];
};


export type MutationSetRecipePreferenceArgs = {
  input: RecipePreferenceInput;
};


export type MutationUpdateChatSessionArgs = {
  id: Scalars['ID']['input'];
  messages?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateRecipeArgs = {
  id: Scalars['ID']['input'];
  input: RecipeInput;
};


export type MutationUpdateTagArgs = {
  aiPrompt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  restrictions?: InputMaybe<Array<Scalars['String']['input']>>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTagCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationWechatLoginArgs = {
  code: Scalars['String']['input'];
};

export type OAuthAccount = {
  __typename?: 'OAuthAccount';
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerUserData?: Maybe<Scalars['String']['output']>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

export enum PreferenceType {
  /** 用户不喜欢 */
  Dislike = 'DISLIKE',
  /** 用户喜欢 */
  Like = 'LIKE'
}

export type Query = {
  __typename?: 'Query';
  chatSession?: Maybe<ChatSession>;
  chatSessions?: Maybe<Array<ChatSession>>;
  checkTagConflicts?: Maybe<Scalars['String']['output']>;
  hello?: Maybe<Scalars['String']['output']>;
  me?: Maybe<User>;
  myChatSessions?: Maybe<Array<ChatSession>>;
  myRecipePreferences?: Maybe<Array<RecipePreference>>;
  myRecipes?: Maybe<Array<Recipe>>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
  recipe?: Maybe<Recipe>;
  recipesByIds?: Maybe<Array<Recipe>>;
  tag?: Maybe<Tag>;
  tagCategories?: Maybe<Array<TagCategory>>;
  tagCategory?: Maybe<TagCategory>;
  tagConflicts?: Maybe<Array<TagConflict>>;
  tags?: Maybe<Array<Tag>>;
  tagsByCategory?: Maybe<Array<Tag>>;
  user?: Maybe<User>;
  userByUsername?: Maybe<User>;
  userSessions?: Maybe<Array<UserSession>>;
};


export type QueryChatSessionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatSessionsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryCheckTagConflictsArgs = {
  tagIds: Array<Scalars['ID']['input']>;
};


export type QueryOauthAccountsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecipesByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTagsByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryUserSessionsArgs = {
  userId: Scalars['String']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  allergens?: Maybe<Array<Scalars['String']['output']>>;
  checksum?: Maybe<Scalars['String']['output']>;
  cookTimeApproxMin?: Maybe<Scalars['Int']['output']>;
  costApprox?: Maybe<Scalars['Int']['output']>;
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  cuisineType?: Maybe<CuisineType>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dietaryTags?: Maybe<Array<Scalars['String']['output']>>;
  difficulty?: Maybe<Difficulty>;
  equipmentsJson?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ingredientsJson?: Maybe<Scalars['String']['output']>;
  leftoverHandling?: Maybe<Scalars['String']['output']>;
  mealType?: Maybe<MealType>;
  name?: Maybe<Scalars['String']['output']>;
  nutrientsJson?: Maybe<Scalars['String']['output']>;
  prepTimeApproxMin?: Maybe<Scalars['Int']['output']>;
  servings?: Maybe<Scalars['Int']['output']>;
  stepsJson?: Maybe<Scalars['String']['output']>;
  tips?: Maybe<Scalars['String']['output']>;
  totalTimeApproxMin?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type RecipeGenerateInput = {
  allergens?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineType?: InputMaybe<CuisineType>;
  description?: InputMaybe<Scalars['String']['input']>;
  dietaryTags?: InputMaybe<Array<Scalars['String']['input']>>;
  mealType?: InputMaybe<MealType>;
  recipeBasicInfo: Scalars['String']['input'];
  recipeName: Scalars['String']['input'];
  servings?: Scalars['Int']['input'];
};

export type RecipeInput = {
  allergens?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTimeApproxMin?: InputMaybe<Scalars['Int']['input']>;
  costApprox?: InputMaybe<Scalars['Int']['input']>;
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  cuisineType?: InputMaybe<CuisineType>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dietaryTags?: InputMaybe<Array<Scalars['String']['input']>>;
  difficulty?: InputMaybe<Difficulty>;
  equipmentsJson?: InputMaybe<Scalars['String']['input']>;
  ingredientsJson: Scalars['String']['input'];
  leftoverHandling?: InputMaybe<Scalars['String']['input']>;
  mealType?: InputMaybe<MealType>;
  name: Scalars['String']['input'];
  nutrientsJson?: InputMaybe<Scalars['String']['input']>;
  prepTimeApproxMin?: InputMaybe<Scalars['Int']['input']>;
  servings: Scalars['Int']['input'];
  stepsJson: Scalars['String']['input'];
  tips?: InputMaybe<Scalars['String']['input']>;
  totalTimeApproxMin?: InputMaybe<Scalars['Int']['input']>;
};

export type RecipePreference = {
  __typename?: 'RecipePreference';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  preference?: Maybe<PreferenceType>;
  recipeBasicInfo?: Maybe<Scalars['String']['output']>;
  recipeId?: Maybe<Scalars['String']['output']>;
  recipeName?: Maybe<Scalars['String']['output']>;
};

export type RecipePreferenceInput = {
  preference: PreferenceType;
  recipeBasicInfo?: InputMaybe<Scalars['String']['input']>;
  recipeId?: InputMaybe<Scalars['String']['input']>;
  recipeName: Scalars['String']['input'];
};

export type RefreshResponse = {
  __typename?: 'RefreshResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
};

export type Tag = {
  __typename?: 'Tag';
  aiPrompt?: Maybe<Scalars['String']['output']>;
  category?: Maybe<TagCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  restrictions?: Maybe<Array<Scalars['String']['output']>>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TagCategory = {
  __typename?: 'TagCategory';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Tag>>;
};

export type TagConflict = {
  __typename?: 'TagConflict';
  conflictType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  tag1?: Maybe<Tag>;
  tag2?: Maybe<Tag>;
  tagId1?: Maybe<Scalars['String']['output']>;
  tagId2?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
  phone?: Maybe<Scalars['String']['output']>;
  sessions?: Maybe<Array<UserSession>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserSession = {
  __typename?: 'UserSession';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  refreshExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  sessionExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type UserBasicFieldsFragment = { __typename?: 'User', id?: string | null, username?: string | null, nickname?: string | null, email?: string | null, avatarUrl?: string | null, isActive?: boolean | null, isVerified?: boolean | null, lastLoginAt?: any | null, createdAt?: any | null, updatedAt?: any | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id?: string | null, username?: string | null, nickname?: string | null, email?: string | null, avatarUrl?: string | null, isActive?: boolean | null, isVerified?: boolean | null, lastLoginAt?: any | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'LoginResponse', sessionToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, nickname?: string | null, email?: string | null, avatarUrl?: string | null, isActive?: boolean | null, isVerified?: boolean | null, lastLoginAt?: any | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type UserByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type UserByUsernameQuery = { __typename?: 'Query', userByUsername?: { __typename?: 'User', id?: string | null } | null };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResponse', sessionToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, nickname?: string | null, email?: string | null, avatarUrl?: string | null, isActive?: boolean | null, isVerified?: boolean | null, lastLoginAt?: any | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type WechatLoginMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type WechatLoginMutation = { __typename?: 'Mutation', wechatLogin?: { __typename?: 'LoginResponse', sessionToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, nickname?: string | null, email?: string | null, avatarUrl?: string | null, isActive?: boolean | null, isVerified?: boolean | null, lastLoginAt?: any | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type RefreshSessionMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshSessionMutation = { __typename?: 'Mutation', refreshSession?: { __typename?: 'RefreshResponse', sessionToken?: string | null, sessionExpiresAt?: any | null } | null };

export type ChatMessageFieldsFragment = { __typename?: 'ChatMessage', id?: string | null, type?: MessageType | null, content?: string | null, role?: MessageRole | null, createdAt?: any | null, status?: MessageStatus | null };

export type GetMyChatSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyChatSessionsQuery = { __typename?: 'Query', myChatSessions?: Array<{ __typename?: 'ChatSession', id?: string | null, title?: string | null, tagIds?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, user?: { __typename?: 'User', id?: string | null, username?: string | null } | null }> | null };

export type GetChatSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetChatSessionQuery = { __typename?: 'Query', chatSession?: { __typename?: 'ChatSession', id?: string | null, title?: string | null, tagIds?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, messages?: Array<{ __typename?: 'ChatMessage', id?: string | null, type?: MessageType | null, content?: string | null, role?: MessageRole | null, createdAt?: any | null, status?: MessageStatus | null }> | null, user?: { __typename?: 'User', id?: string | null, username?: string | null } | null } | null };

export type CreateChatSessionMutationVariables = Exact<{
  title: Scalars['String']['input'];
  messages: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type CreateChatSessionMutation = { __typename?: 'Mutation', createChatSession?: { __typename?: 'ChatSession', id?: string | null, title?: string | null, tagIds?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, messages?: Array<{ __typename?: 'ChatMessage', id?: string | null, type?: MessageType | null, content?: string | null, role?: MessageRole | null, createdAt?: any | null, status?: MessageStatus | null }> | null } | null };

export type UpdateChatSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  messages?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type UpdateChatSessionMutation = { __typename?: 'Mutation', updateChatSession?: { __typename?: 'ChatSession', id?: string | null, title?: string | null, tagIds?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, messages?: Array<{ __typename?: 'ChatMessage', id?: string | null, type?: MessageType | null, content?: string | null, role?: MessageRole | null, createdAt?: any | null, status?: MessageStatus | null }> | null } | null };

export type DeleteChatSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteChatSessionMutation = { __typename?: 'Mutation', deleteChatSession?: boolean | null };

export type RecipeFieldsFragment = { __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null };

export type RecipeBasicFieldsFragment = { __typename?: 'Recipe', id?: string | null, name?: string | null, servings?: number | null, cuisineType?: CuisineType | null, mealType?: MealType | null, costApprox?: number | null, totalTimeApproxMin?: number | null, difficulty?: Difficulty | null, createdAt?: any | null, updatedAt?: any | null };

export type MyRecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRecipesQuery = { __typename?: 'Query', myRecipes?: Array<{ __typename?: 'Recipe', id?: string | null, name?: string | null, servings?: number | null, cuisineType?: CuisineType | null, mealType?: MealType | null, costApprox?: number | null, totalTimeApproxMin?: number | null, difficulty?: Difficulty | null, createdAt?: any | null, updatedAt?: any | null }> | null };

export type GetRecipeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeQuery = { __typename?: 'Query', recipe?: { __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type GetRecipePreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecipePreferencesQuery = { __typename?: 'Query', myRecipePreferences?: Array<{ __typename?: 'RecipePreference', id?: string | null, recipeId?: string | null, recipeName?: string | null, preference?: PreferenceType | null }> | null };

export type GetMyRecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRecipesQuery = { __typename?: 'Query', myRecipes?: Array<{ __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, createdAt?: any | null }> | null };

export type CreateRecipeMutationVariables = Exact<{
  input: RecipeInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe?: { __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type UpdateRecipeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: RecipeInput;
}>;


export type UpdateRecipeMutation = { __typename?: 'Mutation', updateRecipe?: { __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type DeleteRecipeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRecipeMutation = { __typename?: 'Mutation', deleteRecipe?: boolean | null };

export type SetRecipePreferenceMutationVariables = Exact<{
  input: RecipePreferenceInput;
}>;


export type SetRecipePreferenceMutation = { __typename?: 'Mutation', setRecipePreference?: { __typename?: 'RecipePreference', id?: string | null, recipeName?: string | null, preference?: PreferenceType | null } | null };

export type RemoveRecipePreferenceMutationVariables = Exact<{
  recipeId: Scalars['ID']['input'];
}>;


export type RemoveRecipePreferenceMutation = { __typename?: 'Mutation', removeRecipePreference?: boolean | null };

export type GenerateRecipeMutationVariables = Exact<{
  input: RecipeGenerateInput;
}>;


export type GenerateRecipeMutation = { __typename?: 'Mutation', generateRecipe?: { __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type RecipesByIdsQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type RecipesByIdsQuery = { __typename?: 'Query', recipesByIds?: Array<{ __typename?: 'Recipe', id?: string | null, name?: string | null, description?: string | null, coverImageUrl?: string | null, cuisineType?: CuisineType | null, mealType?: MealType | null, servings?: number | null, difficulty?: Difficulty | null, prepTimeApproxMin?: number | null, cookTimeApproxMin?: number | null, totalTimeApproxMin?: number | null, costApprox?: number | null, currency?: string | null, dietaryTags?: Array<string> | null, allergens?: Array<string> | null, tips?: string | null, leftoverHandling?: string | null, ingredientsJson?: string | null, stepsJson?: string | null, nutrientsJson?: string | null, equipmentsJson?: string | null, version?: number | null, checksum?: string | null, createdAt?: any | null, updatedAt?: any | null }> | null };

export type DeleteRecipesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteRecipesMutation = { __typename?: 'Mutation', deleteRecipes?: boolean | null };

export type TagFieldsFragment = { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null, categoryId?: string | null, aiPrompt?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null, updatedAt?: any | null, restrictions?: Array<string> | null };

export type TagCategoryFieldsFragment = { __typename?: 'TagCategory', id?: string | null, name?: string | null, description?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null };

export type TagBasicFieldsFragment = { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null };

export type GetTagsQueryVariables = Exact<{
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTagsQuery = { __typename?: 'Query', tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null, categoryId?: string | null, aiPrompt?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null, updatedAt?: any | null, restrictions?: Array<string> | null, category?: { __typename?: 'TagCategory', id?: string | null, name?: string | null, description?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null } | null }> | null };

export type GetTagCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagCategoriesQuery = { __typename?: 'Query', tagCategories?: Array<{ __typename?: 'TagCategory', id?: string | null, name?: string | null, description?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null }> | null };

export type GetTagQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTagQuery = { __typename?: 'Query', tag?: { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null, categoryId?: string | null, aiPrompt?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null, updatedAt?: any | null, restrictions?: Array<string> | null, category?: { __typename?: 'TagCategory', id?: string | null, name?: string | null, description?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null } | null } | null };

export type GetTagConflictsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagConflictsQuery = { __typename?: 'Query', tagConflicts?: Array<{ __typename?: 'TagConflict', id?: string | null, conflictType?: string | null, description?: string | null, createdAt?: any | null, tagId1?: string | null, tagId2?: string | null, tag1?: { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null } | null, tag2?: { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null } | null }> | null };

export type CheckTagConflictsQueryVariables = Exact<{
  tagIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type CheckTagConflictsQuery = { __typename?: 'Query', checkTagConflicts?: string | null };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  aiPrompt: Scalars['String']['input'];
  restrictions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag?: { __typename?: 'Tag', id?: string | null, name?: string | null, description?: string | null, categoryId?: string | null, aiPrompt?: string | null, sortOrder?: number | null, isActive?: boolean | null, createdAt?: any | null, updatedAt?: any | null, restrictions?: Array<string> | null } | null };


export const UserBasicFieldsFragmentDoc = `
    fragment UserBasicFields on User {
  id
  username
  nickname
  email
  avatarUrl
  isActive
  isVerified
  lastLoginAt
  createdAt
  updatedAt
}
    `;
export const ChatMessageFieldsFragmentDoc = `
    fragment ChatMessageFields on ChatMessage {
  id
  type
  content
  role
  createdAt
  status
}
    `;
export const RecipeFieldsFragmentDoc = `
    fragment RecipeFields on Recipe {
  id
  name
  description
  coverImageUrl
  cuisineType
  mealType
  servings
  difficulty
  prepTimeApproxMin
  cookTimeApproxMin
  totalTimeApproxMin
  costApprox
  currency
  dietaryTags
  allergens
  tips
  leftoverHandling
  ingredientsJson
  stepsJson
  nutrientsJson
  equipmentsJson
  version
  checksum
  createdAt
  updatedAt
}
    `;
export const RecipeBasicFieldsFragmentDoc = `
    fragment RecipeBasicFields on Recipe {
  id
  name
  servings
  cuisineType
  mealType
  costApprox
  totalTimeApproxMin
  difficulty
  createdAt
  updatedAt
}
    `;
export const TagFieldsFragmentDoc = `
    fragment TagFields on Tag {
  id
  name
  description
  categoryId
  aiPrompt
  sortOrder
  isActive
  createdAt
  updatedAt
  restrictions
}
    `;
export const TagCategoryFieldsFragmentDoc = `
    fragment TagCategoryFields on TagCategory {
  id
  name
  description
  sortOrder
  isActive
  createdAt
}
    `;
export const TagBasicFieldsFragmentDoc = `
    fragment TagBasicFields on Tag {
  id
  name
  description
}
    `;
export const GetMeDocument = `
    query GetMe {
  me {
    ...UserBasicFields
  }
}
    ${UserBasicFieldsFragmentDoc}`;

export const useGetMeQuery = <
      TData = GetMeQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetMeQueryVariables,
      options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMeQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetMeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
    queryFn: fetcher<GetMeQuery, GetMeQueryVariables>(client, GetMeDocument, variables, headers),
    ...options
  }
    )};

useGetMeQuery.getKey = (variables?: GetMeQueryVariables) => variables === undefined ? ['GetMe'] : ['GetMe', variables];


useGetMeQuery.fetcher = (client: GraphQLClient, variables?: GetMeQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMeQuery, GetMeQueryVariables>(client, GetMeDocument, variables, headers);

export const RegisterDocument = `
    mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    user {
      ...UserBasicFields
    }
    sessionToken
    csrfToken
  }
}
    ${UserBasicFieldsFragmentDoc}`;

export const useRegisterMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RegisterMutation, TError, RegisterMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<RegisterMutation, TError, RegisterMutationVariables, TContext>(
      {
    mutationKey: ['Register'],
    mutationFn: (variables?: RegisterMutationVariables) => fetcher<RegisterMutation, RegisterMutationVariables>(client, RegisterDocument, variables, headers)(),
    ...options
  }
    )};


useRegisterMutation.fetcher = (client: GraphQLClient, variables: RegisterMutationVariables, headers?: RequestInit['headers']) => fetcher<RegisterMutation, RegisterMutationVariables>(client, RegisterDocument, variables, headers);

export const UserByUsernameDocument = `
    query UserByUsername($username: String!) {
  userByUsername(username: $username) {
    id
  }
}
    `;

export const useUserByUsernameQuery = <
      TData = UserByUsernameQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: UserByUsernameQueryVariables,
      options?: Omit<UseQueryOptions<UserByUsernameQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UserByUsernameQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<UserByUsernameQuery, TError, TData>(
      {
    queryKey: ['UserByUsername', variables],
    queryFn: fetcher<UserByUsernameQuery, UserByUsernameQueryVariables>(client, UserByUsernameDocument, variables, headers),
    ...options
  }
    )};

useUserByUsernameQuery.getKey = (variables: UserByUsernameQueryVariables) => ['UserByUsername', variables];


useUserByUsernameQuery.fetcher = (client: GraphQLClient, variables: UserByUsernameQueryVariables, headers?: RequestInit['headers']) => fetcher<UserByUsernameQuery, UserByUsernameQueryVariables>(client, UserByUsernameDocument, variables, headers);

export const LoginDocument = `
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      ...UserBasicFields
    }
    sessionToken
    csrfToken
  }
}
    ${UserBasicFieldsFragmentDoc}`;

export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      {
    mutationKey: ['Login'],
    mutationFn: (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers)(),
    ...options
  }
    )};


useLoginMutation.fetcher = (client: GraphQLClient, variables: LoginMutationVariables, headers?: RequestInit['headers']) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers);

export const LogoutDocument = `
    mutation Logout {
  logout
}
    `;

export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      {
    mutationKey: ['Logout'],
    mutationFn: (variables?: LogoutMutationVariables) => fetcher<LogoutMutation, LogoutMutationVariables>(client, LogoutDocument, variables, headers)(),
    ...options
  }
    )};


useLogoutMutation.fetcher = (client: GraphQLClient, variables?: LogoutMutationVariables, headers?: RequestInit['headers']) => fetcher<LogoutMutation, LogoutMutationVariables>(client, LogoutDocument, variables, headers);

export const WechatLoginDocument = `
    mutation WechatLogin($code: String!) {
  wechatLogin(code: $code) {
    user {
      ...UserBasicFields
    }
    sessionToken
    csrfToken
  }
}
    ${UserBasicFieldsFragmentDoc}`;

export const useWechatLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<WechatLoginMutation, TError, WechatLoginMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<WechatLoginMutation, TError, WechatLoginMutationVariables, TContext>(
      {
    mutationKey: ['WechatLogin'],
    mutationFn: (variables?: WechatLoginMutationVariables) => fetcher<WechatLoginMutation, WechatLoginMutationVariables>(client, WechatLoginDocument, variables, headers)(),
    ...options
  }
    )};


useWechatLoginMutation.fetcher = (client: GraphQLClient, variables: WechatLoginMutationVariables, headers?: RequestInit['headers']) => fetcher<WechatLoginMutation, WechatLoginMutationVariables>(client, WechatLoginDocument, variables, headers);

export const RefreshSessionDocument = `
    mutation RefreshSession($refreshToken: String!) {
  refreshSession(refreshToken: $refreshToken) {
    sessionToken
    sessionExpiresAt
  }
}
    `;

export const useRefreshSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RefreshSessionMutation, TError, RefreshSessionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<RefreshSessionMutation, TError, RefreshSessionMutationVariables, TContext>(
      {
    mutationKey: ['RefreshSession'],
    mutationFn: (variables?: RefreshSessionMutationVariables) => fetcher<RefreshSessionMutation, RefreshSessionMutationVariables>(client, RefreshSessionDocument, variables, headers)(),
    ...options
  }
    )};


useRefreshSessionMutation.fetcher = (client: GraphQLClient, variables: RefreshSessionMutationVariables, headers?: RequestInit['headers']) => fetcher<RefreshSessionMutation, RefreshSessionMutationVariables>(client, RefreshSessionDocument, variables, headers);

export const GetMyChatSessionsDocument = `
    query GetMyChatSessions {
  myChatSessions {
    id
    title
    tagIds
    createdAt
    updatedAt
    user {
      id
      username
    }
  }
}
    `;

export const useGetMyChatSessionsQuery = <
      TData = GetMyChatSessionsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetMyChatSessionsQueryVariables,
      options?: Omit<UseQueryOptions<GetMyChatSessionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMyChatSessionsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetMyChatSessionsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMyChatSessions'] : ['GetMyChatSessions', variables],
    queryFn: fetcher<GetMyChatSessionsQuery, GetMyChatSessionsQueryVariables>(client, GetMyChatSessionsDocument, variables, headers),
    ...options
  }
    )};

useGetMyChatSessionsQuery.getKey = (variables?: GetMyChatSessionsQueryVariables) => variables === undefined ? ['GetMyChatSessions'] : ['GetMyChatSessions', variables];


useGetMyChatSessionsQuery.fetcher = (client: GraphQLClient, variables?: GetMyChatSessionsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMyChatSessionsQuery, GetMyChatSessionsQueryVariables>(client, GetMyChatSessionsDocument, variables, headers);

export const GetChatSessionDocument = `
    query GetChatSession($id: ID!) {
  chatSession(id: $id) {
    id
    title
    messages {
      ...ChatMessageFields
    }
    tagIds
    createdAt
    updatedAt
    user {
      id
      username
    }
  }
}
    ${ChatMessageFieldsFragmentDoc}`;

export const useGetChatSessionQuery = <
      TData = GetChatSessionQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetChatSessionQueryVariables,
      options?: Omit<UseQueryOptions<GetChatSessionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetChatSessionQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetChatSessionQuery, TError, TData>(
      {
    queryKey: ['GetChatSession', variables],
    queryFn: fetcher<GetChatSessionQuery, GetChatSessionQueryVariables>(client, GetChatSessionDocument, variables, headers),
    ...options
  }
    )};

useGetChatSessionQuery.getKey = (variables: GetChatSessionQueryVariables) => ['GetChatSession', variables];


useGetChatSessionQuery.fetcher = (client: GraphQLClient, variables: GetChatSessionQueryVariables, headers?: RequestInit['headers']) => fetcher<GetChatSessionQuery, GetChatSessionQueryVariables>(client, GetChatSessionDocument, variables, headers);

export const CreateChatSessionDocument = `
    mutation CreateChatSession($title: String!, $messages: String!, $tagIds: [ID!]) {
  createChatSession(title: $title, messages: $messages, tagIds: $tagIds) {
    id
    title
    messages {
      ...ChatMessageFields
    }
    tagIds
    createdAt
    updatedAt
  }
}
    ${ChatMessageFieldsFragmentDoc}`;

export const useCreateChatSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateChatSessionMutation, TError, CreateChatSessionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<CreateChatSessionMutation, TError, CreateChatSessionMutationVariables, TContext>(
      {
    mutationKey: ['CreateChatSession'],
    mutationFn: (variables?: CreateChatSessionMutationVariables) => fetcher<CreateChatSessionMutation, CreateChatSessionMutationVariables>(client, CreateChatSessionDocument, variables, headers)(),
    ...options
  }
    )};


useCreateChatSessionMutation.fetcher = (client: GraphQLClient, variables: CreateChatSessionMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateChatSessionMutation, CreateChatSessionMutationVariables>(client, CreateChatSessionDocument, variables, headers);

export const UpdateChatSessionDocument = `
    mutation UpdateChatSession($id: ID!, $title: String, $messages: String, $tagIds: [ID!]) {
  updateChatSession(id: $id, title: $title, messages: $messages, tagIds: $tagIds) {
    id
    title
    messages {
      ...ChatMessageFields
    }
    tagIds
    createdAt
    updatedAt
  }
}
    ${ChatMessageFieldsFragmentDoc}`;

export const useUpdateChatSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateChatSessionMutation, TError, UpdateChatSessionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<UpdateChatSessionMutation, TError, UpdateChatSessionMutationVariables, TContext>(
      {
    mutationKey: ['UpdateChatSession'],
    mutationFn: (variables?: UpdateChatSessionMutationVariables) => fetcher<UpdateChatSessionMutation, UpdateChatSessionMutationVariables>(client, UpdateChatSessionDocument, variables, headers)(),
    ...options
  }
    )};


useUpdateChatSessionMutation.fetcher = (client: GraphQLClient, variables: UpdateChatSessionMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateChatSessionMutation, UpdateChatSessionMutationVariables>(client, UpdateChatSessionDocument, variables, headers);

export const DeleteChatSessionDocument = `
    mutation DeleteChatSession($id: ID!) {
  deleteChatSession(id: $id)
}
    `;

export const useDeleteChatSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteChatSessionMutation, TError, DeleteChatSessionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<DeleteChatSessionMutation, TError, DeleteChatSessionMutationVariables, TContext>(
      {
    mutationKey: ['DeleteChatSession'],
    mutationFn: (variables?: DeleteChatSessionMutationVariables) => fetcher<DeleteChatSessionMutation, DeleteChatSessionMutationVariables>(client, DeleteChatSessionDocument, variables, headers)(),
    ...options
  }
    )};


useDeleteChatSessionMutation.fetcher = (client: GraphQLClient, variables: DeleteChatSessionMutationVariables, headers?: RequestInit['headers']) => fetcher<DeleteChatSessionMutation, DeleteChatSessionMutationVariables>(client, DeleteChatSessionDocument, variables, headers);

export const MyRecipesDocument = `
    query MyRecipes {
  myRecipes {
    ...RecipeBasicFields
  }
}
    ${RecipeBasicFieldsFragmentDoc}`;

export const useMyRecipesQuery = <
      TData = MyRecipesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: MyRecipesQueryVariables,
      options?: Omit<UseQueryOptions<MyRecipesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MyRecipesQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<MyRecipesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MyRecipes'] : ['MyRecipes', variables],
    queryFn: fetcher<MyRecipesQuery, MyRecipesQueryVariables>(client, MyRecipesDocument, variables, headers),
    ...options
  }
    )};

useMyRecipesQuery.getKey = (variables?: MyRecipesQueryVariables) => variables === undefined ? ['MyRecipes'] : ['MyRecipes', variables];


useMyRecipesQuery.fetcher = (client: GraphQLClient, variables?: MyRecipesQueryVariables, headers?: RequestInit['headers']) => fetcher<MyRecipesQuery, MyRecipesQueryVariables>(client, MyRecipesDocument, variables, headers);

export const GetRecipeDocument = `
    query GetRecipe($id: ID!) {
  recipe(id: $id) {
    ...RecipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

export const useGetRecipeQuery = <
      TData = GetRecipeQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetRecipeQueryVariables,
      options?: Omit<UseQueryOptions<GetRecipeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetRecipeQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetRecipeQuery, TError, TData>(
      {
    queryKey: ['GetRecipe', variables],
    queryFn: fetcher<GetRecipeQuery, GetRecipeQueryVariables>(client, GetRecipeDocument, variables, headers),
    ...options
  }
    )};

useGetRecipeQuery.getKey = (variables: GetRecipeQueryVariables) => ['GetRecipe', variables];


useGetRecipeQuery.fetcher = (client: GraphQLClient, variables: GetRecipeQueryVariables, headers?: RequestInit['headers']) => fetcher<GetRecipeQuery, GetRecipeQueryVariables>(client, GetRecipeDocument, variables, headers);

export const GetRecipePreferencesDocument = `
    query GetRecipePreferences {
  myRecipePreferences {
    id
    recipeId
    recipeName
    preference
  }
}
    `;

export const useGetRecipePreferencesQuery = <
      TData = GetRecipePreferencesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetRecipePreferencesQueryVariables,
      options?: Omit<UseQueryOptions<GetRecipePreferencesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetRecipePreferencesQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetRecipePreferencesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetRecipePreferences'] : ['GetRecipePreferences', variables],
    queryFn: fetcher<GetRecipePreferencesQuery, GetRecipePreferencesQueryVariables>(client, GetRecipePreferencesDocument, variables, headers),
    ...options
  }
    )};

useGetRecipePreferencesQuery.getKey = (variables?: GetRecipePreferencesQueryVariables) => variables === undefined ? ['GetRecipePreferences'] : ['GetRecipePreferences', variables];


useGetRecipePreferencesQuery.fetcher = (client: GraphQLClient, variables?: GetRecipePreferencesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetRecipePreferencesQuery, GetRecipePreferencesQueryVariables>(client, GetRecipePreferencesDocument, variables, headers);

export const GetMyRecipesDocument = `
    query GetMyRecipes {
  myRecipes {
    id
    name
    description
    difficulty
    prepTimeApproxMin
    cookTimeApproxMin
    totalTimeApproxMin
    costApprox
    currency
    createdAt
  }
}
    `;

export const useGetMyRecipesQuery = <
      TData = GetMyRecipesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetMyRecipesQueryVariables,
      options?: Omit<UseQueryOptions<GetMyRecipesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMyRecipesQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetMyRecipesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMyRecipes'] : ['GetMyRecipes', variables],
    queryFn: fetcher<GetMyRecipesQuery, GetMyRecipesQueryVariables>(client, GetMyRecipesDocument, variables, headers),
    ...options
  }
    )};

useGetMyRecipesQuery.getKey = (variables?: GetMyRecipesQueryVariables) => variables === undefined ? ['GetMyRecipes'] : ['GetMyRecipes', variables];


useGetMyRecipesQuery.fetcher = (client: GraphQLClient, variables?: GetMyRecipesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMyRecipesQuery, GetMyRecipesQueryVariables>(client, GetMyRecipesDocument, variables, headers);

export const CreateRecipeDocument = `
    mutation CreateRecipe($input: RecipeInput!) {
  createRecipe(input: $input) {
    ...RecipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

export const useCreateRecipeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateRecipeMutation, TError, CreateRecipeMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<CreateRecipeMutation, TError, CreateRecipeMutationVariables, TContext>(
      {
    mutationKey: ['CreateRecipe'],
    mutationFn: (variables?: CreateRecipeMutationVariables) => fetcher<CreateRecipeMutation, CreateRecipeMutationVariables>(client, CreateRecipeDocument, variables, headers)(),
    ...options
  }
    )};


useCreateRecipeMutation.fetcher = (client: GraphQLClient, variables: CreateRecipeMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateRecipeMutation, CreateRecipeMutationVariables>(client, CreateRecipeDocument, variables, headers);

export const UpdateRecipeDocument = `
    mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
  updateRecipe(id: $id, input: $input) {
    ...RecipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

export const useUpdateRecipeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateRecipeMutation, TError, UpdateRecipeMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<UpdateRecipeMutation, TError, UpdateRecipeMutationVariables, TContext>(
      {
    mutationKey: ['UpdateRecipe'],
    mutationFn: (variables?: UpdateRecipeMutationVariables) => fetcher<UpdateRecipeMutation, UpdateRecipeMutationVariables>(client, UpdateRecipeDocument, variables, headers)(),
    ...options
  }
    )};


useUpdateRecipeMutation.fetcher = (client: GraphQLClient, variables: UpdateRecipeMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateRecipeMutation, UpdateRecipeMutationVariables>(client, UpdateRecipeDocument, variables, headers);

export const DeleteRecipeDocument = `
    mutation DeleteRecipe($id: ID!) {
  deleteRecipe(id: $id)
}
    `;

export const useDeleteRecipeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteRecipeMutation, TError, DeleteRecipeMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<DeleteRecipeMutation, TError, DeleteRecipeMutationVariables, TContext>(
      {
    mutationKey: ['DeleteRecipe'],
    mutationFn: (variables?: DeleteRecipeMutationVariables) => fetcher<DeleteRecipeMutation, DeleteRecipeMutationVariables>(client, DeleteRecipeDocument, variables, headers)(),
    ...options
  }
    )};


useDeleteRecipeMutation.fetcher = (client: GraphQLClient, variables: DeleteRecipeMutationVariables, headers?: RequestInit['headers']) => fetcher<DeleteRecipeMutation, DeleteRecipeMutationVariables>(client, DeleteRecipeDocument, variables, headers);

export const SetRecipePreferenceDocument = `
    mutation SetRecipePreference($input: RecipePreferenceInput!) {
  setRecipePreference(input: $input) {
    id
    recipeName
    preference
  }
}
    `;

export const useSetRecipePreferenceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<SetRecipePreferenceMutation, TError, SetRecipePreferenceMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<SetRecipePreferenceMutation, TError, SetRecipePreferenceMutationVariables, TContext>(
      {
    mutationKey: ['SetRecipePreference'],
    mutationFn: (variables?: SetRecipePreferenceMutationVariables) => fetcher<SetRecipePreferenceMutation, SetRecipePreferenceMutationVariables>(client, SetRecipePreferenceDocument, variables, headers)(),
    ...options
  }
    )};


useSetRecipePreferenceMutation.fetcher = (client: GraphQLClient, variables: SetRecipePreferenceMutationVariables, headers?: RequestInit['headers']) => fetcher<SetRecipePreferenceMutation, SetRecipePreferenceMutationVariables>(client, SetRecipePreferenceDocument, variables, headers);

export const RemoveRecipePreferenceDocument = `
    mutation RemoveRecipePreference($recipeId: ID!) {
  removeRecipePreference(recipeId: $recipeId)
}
    `;

export const useRemoveRecipePreferenceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RemoveRecipePreferenceMutation, TError, RemoveRecipePreferenceMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<RemoveRecipePreferenceMutation, TError, RemoveRecipePreferenceMutationVariables, TContext>(
      {
    mutationKey: ['RemoveRecipePreference'],
    mutationFn: (variables?: RemoveRecipePreferenceMutationVariables) => fetcher<RemoveRecipePreferenceMutation, RemoveRecipePreferenceMutationVariables>(client, RemoveRecipePreferenceDocument, variables, headers)(),
    ...options
  }
    )};


useRemoveRecipePreferenceMutation.fetcher = (client: GraphQLClient, variables: RemoveRecipePreferenceMutationVariables, headers?: RequestInit['headers']) => fetcher<RemoveRecipePreferenceMutation, RemoveRecipePreferenceMutationVariables>(client, RemoveRecipePreferenceDocument, variables, headers);

export const GenerateRecipeDocument = `
    mutation GenerateRecipe($input: RecipeGenerateInput!) {
  generateRecipe(input: $input) {
    ...RecipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

export const useGenerateRecipeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<GenerateRecipeMutation, TError, GenerateRecipeMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<GenerateRecipeMutation, TError, GenerateRecipeMutationVariables, TContext>(
      {
    mutationKey: ['GenerateRecipe'],
    mutationFn: (variables?: GenerateRecipeMutationVariables) => fetcher<GenerateRecipeMutation, GenerateRecipeMutationVariables>(client, GenerateRecipeDocument, variables, headers)(),
    ...options
  }
    )};


useGenerateRecipeMutation.fetcher = (client: GraphQLClient, variables: GenerateRecipeMutationVariables, headers?: RequestInit['headers']) => fetcher<GenerateRecipeMutation, GenerateRecipeMutationVariables>(client, GenerateRecipeDocument, variables, headers);

export const RecipesByIdsDocument = `
    query RecipesByIds($ids: [ID!]!) {
  recipesByIds(ids: $ids) {
    ...RecipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

export const useRecipesByIdsQuery = <
      TData = RecipesByIdsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: RecipesByIdsQueryVariables,
      options?: Omit<UseQueryOptions<RecipesByIdsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<RecipesByIdsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<RecipesByIdsQuery, TError, TData>(
      {
    queryKey: ['RecipesByIds', variables],
    queryFn: fetcher<RecipesByIdsQuery, RecipesByIdsQueryVariables>(client, RecipesByIdsDocument, variables, headers),
    ...options
  }
    )};

useRecipesByIdsQuery.getKey = (variables: RecipesByIdsQueryVariables) => ['RecipesByIds', variables];


useRecipesByIdsQuery.fetcher = (client: GraphQLClient, variables: RecipesByIdsQueryVariables, headers?: RequestInit['headers']) => fetcher<RecipesByIdsQuery, RecipesByIdsQueryVariables>(client, RecipesByIdsDocument, variables, headers);

export const DeleteRecipesDocument = `
    mutation DeleteRecipes($ids: [ID!]!) {
  deleteRecipes(ids: $ids)
}
    `;

export const useDeleteRecipesMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteRecipesMutation, TError, DeleteRecipesMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<DeleteRecipesMutation, TError, DeleteRecipesMutationVariables, TContext>(
      {
    mutationKey: ['DeleteRecipes'],
    mutationFn: (variables?: DeleteRecipesMutationVariables) => fetcher<DeleteRecipesMutation, DeleteRecipesMutationVariables>(client, DeleteRecipesDocument, variables, headers)(),
    ...options
  }
    )};


useDeleteRecipesMutation.fetcher = (client: GraphQLClient, variables: DeleteRecipesMutationVariables, headers?: RequestInit['headers']) => fetcher<DeleteRecipesMutation, DeleteRecipesMutationVariables>(client, DeleteRecipesDocument, variables, headers);

export const GetTagsDocument = `
    query GetTags($categoryId: ID, $search: String) {
  tags(categoryId: $categoryId, search: $search) {
    ...TagFields
    category {
      ...TagCategoryFields
    }
  }
}
    ${TagFieldsFragmentDoc}
${TagCategoryFieldsFragmentDoc}`;

export const useGetTagsQuery = <
      TData = GetTagsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetTagsQueryVariables,
      options?: Omit<UseQueryOptions<GetTagsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTagsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetTagsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetTags'] : ['GetTags', variables],
    queryFn: fetcher<GetTagsQuery, GetTagsQueryVariables>(client, GetTagsDocument, variables, headers),
    ...options
  }
    )};

useGetTagsQuery.getKey = (variables?: GetTagsQueryVariables) => variables === undefined ? ['GetTags'] : ['GetTags', variables];


useGetTagsQuery.fetcher = (client: GraphQLClient, variables?: GetTagsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetTagsQuery, GetTagsQueryVariables>(client, GetTagsDocument, variables, headers);

export const GetTagCategoriesDocument = `
    query GetTagCategories {
  tagCategories {
    ...TagCategoryFields
  }
}
    ${TagCategoryFieldsFragmentDoc}`;

export const useGetTagCategoriesQuery = <
      TData = GetTagCategoriesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetTagCategoriesQueryVariables,
      options?: Omit<UseQueryOptions<GetTagCategoriesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTagCategoriesQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetTagCategoriesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetTagCategories'] : ['GetTagCategories', variables],
    queryFn: fetcher<GetTagCategoriesQuery, GetTagCategoriesQueryVariables>(client, GetTagCategoriesDocument, variables, headers),
    ...options
  }
    )};

useGetTagCategoriesQuery.getKey = (variables?: GetTagCategoriesQueryVariables) => variables === undefined ? ['GetTagCategories'] : ['GetTagCategories', variables];


useGetTagCategoriesQuery.fetcher = (client: GraphQLClient, variables?: GetTagCategoriesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetTagCategoriesQuery, GetTagCategoriesQueryVariables>(client, GetTagCategoriesDocument, variables, headers);

export const GetTagDocument = `
    query GetTag($id: ID!) {
  tag(id: $id) {
    ...TagFields
    category {
      ...TagCategoryFields
    }
  }
}
    ${TagFieldsFragmentDoc}
${TagCategoryFieldsFragmentDoc}`;

export const useGetTagQuery = <
      TData = GetTagQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetTagQueryVariables,
      options?: Omit<UseQueryOptions<GetTagQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTagQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetTagQuery, TError, TData>(
      {
    queryKey: ['GetTag', variables],
    queryFn: fetcher<GetTagQuery, GetTagQueryVariables>(client, GetTagDocument, variables, headers),
    ...options
  }
    )};

useGetTagQuery.getKey = (variables: GetTagQueryVariables) => ['GetTag', variables];


useGetTagQuery.fetcher = (client: GraphQLClient, variables: GetTagQueryVariables, headers?: RequestInit['headers']) => fetcher<GetTagQuery, GetTagQueryVariables>(client, GetTagDocument, variables, headers);

export const GetTagConflictsDocument = `
    query GetTagConflicts {
  tagConflicts {
    id
    conflictType
    description
    createdAt
    tagId1
    tagId2
    tag1 {
      ...TagBasicFields
    }
    tag2 {
      ...TagBasicFields
    }
  }
}
    ${TagBasicFieldsFragmentDoc}`;

export const useGetTagConflictsQuery = <
      TData = GetTagConflictsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetTagConflictsQueryVariables,
      options?: Omit<UseQueryOptions<GetTagConflictsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTagConflictsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<GetTagConflictsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetTagConflicts'] : ['GetTagConflicts', variables],
    queryFn: fetcher<GetTagConflictsQuery, GetTagConflictsQueryVariables>(client, GetTagConflictsDocument, variables, headers),
    ...options
  }
    )};

useGetTagConflictsQuery.getKey = (variables?: GetTagConflictsQueryVariables) => variables === undefined ? ['GetTagConflicts'] : ['GetTagConflicts', variables];


useGetTagConflictsQuery.fetcher = (client: GraphQLClient, variables?: GetTagConflictsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetTagConflictsQuery, GetTagConflictsQueryVariables>(client, GetTagConflictsDocument, variables, headers);

export const CheckTagConflictsDocument = `
    query CheckTagConflicts($tagIds: [ID!]!) {
  checkTagConflicts(tagIds: $tagIds)
}
    `;

export const useCheckTagConflictsQuery = <
      TData = CheckTagConflictsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: CheckTagConflictsQueryVariables,
      options?: Omit<UseQueryOptions<CheckTagConflictsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CheckTagConflictsQuery, TError, TData>['queryKey'] },
      headers?: RequestInit['headers']
    ) => {
    
    return useQuery<CheckTagConflictsQuery, TError, TData>(
      {
    queryKey: ['CheckTagConflicts', variables],
    queryFn: fetcher<CheckTagConflictsQuery, CheckTagConflictsQueryVariables>(client, CheckTagConflictsDocument, variables, headers),
    ...options
  }
    )};

useCheckTagConflictsQuery.getKey = (variables: CheckTagConflictsQueryVariables) => ['CheckTagConflicts', variables];


useCheckTagConflictsQuery.fetcher = (client: GraphQLClient, variables: CheckTagConflictsQueryVariables, headers?: RequestInit['headers']) => fetcher<CheckTagConflictsQuery, CheckTagConflictsQueryVariables>(client, CheckTagConflictsDocument, variables, headers);

export const CreateTagDocument = `
    mutation CreateTag($name: String!, $description: String!, $categoryId: ID!, $aiPrompt: String!, $restrictions: [String!], $sortOrder: Int) {
  createTag(
    name: $name
    description: $description
    categoryId: $categoryId
    aiPrompt: $aiPrompt
    restrictions: $restrictions
    sortOrder: $sortOrder
  ) {
    ...TagFields
  }
}
    ${TagFieldsFragmentDoc}`;

export const useCreateTagMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateTagMutation, TError, CreateTagMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) => {
    
    return useMutation<CreateTagMutation, TError, CreateTagMutationVariables, TContext>(
      {
    mutationKey: ['CreateTag'],
    mutationFn: (variables?: CreateTagMutationVariables) => fetcher<CreateTagMutation, CreateTagMutationVariables>(client, CreateTagDocument, variables, headers)(),
    ...options
  }
    )};


useCreateTagMutation.fetcher = (client: GraphQLClient, variables: CreateTagMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateTagMutation, CreateTagMutationVariables>(client, CreateTagDocument, variables, headers);
