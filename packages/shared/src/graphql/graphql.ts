/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CsrfToken = {
  __typename?: 'CSRFToken';
  createdAt?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ChatResponse = {
  __typename?: 'ChatResponse';
  response?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
};

export type ChatSession = {
  __typename?: 'ChatSession';
  createdAt?: Maybe<Scalars['String']['output']>;
  currentTags?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['ID']['output']>;
  messages?: Maybe<Array<ChatMessage>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkUsername?: Maybe<Scalars['Boolean']['output']>;
  createCSRFToken?: Maybe<CsrfToken>;
  createChatSession?: Maybe<ChatSession>;
  createOAuthAccount?: Maybe<OAuthAccount>;
  createTag?: Maybe<Tag>;
  createTagCategory?: Maybe<TagCategory>;
  createTagConflict?: Maybe<TagConflict>;
  createUser?: Maybe<User>;
  createUserSession?: Maybe<UserSession>;
  deleteCSRFToken?: Maybe<Scalars['Boolean']['output']>;
  deleteChatSession?: Maybe<Scalars['Boolean']['output']>;
  deleteTag?: Maybe<Scalars['Boolean']['output']>;
  deleteTagCategory?: Maybe<Scalars['Boolean']['output']>;
  deleteTagConflict?: Maybe<Scalars['Boolean']['output']>;
  deleteUserSession?: Maybe<Scalars['Boolean']['output']>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  refreshSession?: Maybe<RefreshResponse>;
  register?: Maybe<Scalars['String']['output']>;
  updateChatSession?: Maybe<ChatSession>;
  updateTag?: Maybe<Tag>;
  updateTagCategory?: Maybe<TagCategory>;
  updateUser?: Maybe<User>;
  wechatLogin?: Maybe<WechatLoginResponse>;
};


export type MutationCheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type MutationCreateCsrfTokenArgs = {
  expiresAt: Scalars['String']['input'];
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateChatSessionArgs = {
  currentTags?: InputMaybe<Scalars['String']['input']>;
  messages: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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


export type MutationCreateTagArgs = {
  aiPrompt: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
  description: Scalars['String']['input'];
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
  tagId1: Scalars['String']['input'];
  tagId2: Scalars['String']['input'];
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


export type MutationDeleteCsrfTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationDeleteChatSessionArgs = {
  id: Scalars['ID']['input'];
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


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRefreshSessionArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateChatSessionArgs = {
  currentTags?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  messages?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerUserData?: Maybe<Scalars['String']['output']>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  chatSession?: Maybe<ChatSession>;
  chatSessions?: Maybe<Array<ChatSession>>;
  checkTagConflicts?: Maybe<Scalars['String']['output']>;
  hello?: Maybe<Scalars['String']['output']>;
  me?: Maybe<User>;
  myChatSessions?: Maybe<Array<ChatSession>>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
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
  userId: Scalars['String']['input'];
};


export type QueryCheckTagConflictsArgs = {
  tagIds: Array<Scalars['String']['input']>;
};


export type QueryOauthAccountsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTagsByCategoryArgs = {
  categoryId: Scalars['String']['input'];
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

export type RefreshResponse = {
  __typename?: 'RefreshResponse';
  sessionExpiresAt?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
};

export type Tag = {
  __typename?: 'Tag';
  aiPrompt?: Maybe<Scalars['String']['output']>;
  category?: Maybe<TagCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  restrictions?: Maybe<Array<Scalars['String']['output']>>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type TagCategory = {
  __typename?: 'TagCategory';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
};

export type TagConflict = {
  __typename?: 'TagConflict';
  conflictType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastLoginAt?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
  phone?: Maybe<Scalars['String']['output']>;
  sessions?: Maybe<Array<UserSession>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserSession = {
  __typename?: 'UserSession';
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  refreshExpiresAt?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  sessionExpiresAt?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type WechatLoginResponse = {
  __typename?: 'WechatLoginResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CsrfToken = {
  __typename?: 'CSRFToken';
  createdAt?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ChatResponse = {
  __typename?: 'ChatResponse';
  response?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
};

export type ChatSession = {
  __typename?: 'ChatSession';
  createdAt?: Maybe<Scalars['String']['output']>;
  currentTags?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['ID']['output']>;
  messages?: Maybe<Array<ChatMessage>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkUsername?: Maybe<Scalars['Boolean']['output']>;
  createCSRFToken?: Maybe<CsrfToken>;
  createChatSession?: Maybe<ChatSession>;
  createOAuthAccount?: Maybe<OAuthAccount>;
  createTag?: Maybe<Tag>;
  createTagCategory?: Maybe<TagCategory>;
  createTagConflict?: Maybe<TagConflict>;
  createUser?: Maybe<User>;
  createUserSession?: Maybe<UserSession>;
  deleteCSRFToken?: Maybe<Scalars['Boolean']['output']>;
  deleteChatSession?: Maybe<Scalars['Boolean']['output']>;
  deleteTag?: Maybe<Scalars['Boolean']['output']>;
  deleteTagCategory?: Maybe<Scalars['Boolean']['output']>;
  deleteTagConflict?: Maybe<Scalars['Boolean']['output']>;
  deleteUserSession?: Maybe<Scalars['Boolean']['output']>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  refreshSession?: Maybe<RefreshResponse>;
  register?: Maybe<Scalars['String']['output']>;
  updateChatSession?: Maybe<ChatSession>;
  updateTag?: Maybe<Tag>;
  updateTagCategory?: Maybe<TagCategory>;
  updateUser?: Maybe<User>;
  wechatLogin?: Maybe<WechatLoginResponse>;
};


export type MutationCheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type MutationCreateCsrfTokenArgs = {
  expiresAt: Scalars['String']['input'];
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateChatSessionArgs = {
  currentTags?: InputMaybe<Scalars['String']['input']>;
  messages: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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


export type MutationCreateTagArgs = {
  aiPrompt: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
  description: Scalars['String']['input'];
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
  tagId1: Scalars['String']['input'];
  tagId2: Scalars['String']['input'];
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


export type MutationDeleteCsrfTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationDeleteChatSessionArgs = {
  id: Scalars['ID']['input'];
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


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRefreshSessionArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateChatSessionArgs = {
  currentTags?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  messages?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerUserData?: Maybe<Scalars['String']['output']>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  chatSession?: Maybe<ChatSession>;
  chatSessions?: Maybe<Array<ChatSession>>;
  checkTagConflicts?: Maybe<Scalars['String']['output']>;
  hello?: Maybe<Scalars['String']['output']>;
  me?: Maybe<User>;
  myChatSessions?: Maybe<Array<ChatSession>>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
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
  userId: Scalars['String']['input'];
};


export type QueryCheckTagConflictsArgs = {
  tagIds: Array<Scalars['String']['input']>;
};


export type QueryOauthAccountsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTagsByCategoryArgs = {
  categoryId: Scalars['String']['input'];
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

export type RefreshResponse = {
  __typename?: 'RefreshResponse';
  sessionExpiresAt?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
};

export type Tag = {
  __typename?: 'Tag';
  aiPrompt?: Maybe<Scalars['String']['output']>;
  category?: Maybe<TagCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  restrictions?: Maybe<Array<Scalars['String']['output']>>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type TagCategory = {
  __typename?: 'TagCategory';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
};

export type TagConflict = {
  __typename?: 'TagConflict';
  conflictType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastLoginAt?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  oauthAccounts?: Maybe<Array<OAuthAccount>>;
  phone?: Maybe<Scalars['String']['output']>;
  sessions?: Maybe<Array<UserSession>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserSession = {
  __typename?: 'UserSession';
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  refreshExpiresAt?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  sessionExpiresAt?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type WechatLoginResponse = {
  __typename?: 'WechatLoginResponse';
  csrfToken?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};


