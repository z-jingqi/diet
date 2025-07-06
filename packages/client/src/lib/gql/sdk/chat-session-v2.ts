import { graphqlClient } from "../client";
import {
  CreateChatSessionDocument,
  UpdateChatSessionDocument,
  DeleteChatSessionDocument,
  GetChatSessionDocument,
  type CreateChatSessionMutationVariables,
  type UpdateChatSessionMutationVariables,
  type CreateChatSessionMutation,
  type UpdateChatSessionMutation,
  type DeleteChatSessionMutation,
  type GetChatSessionQuery,
  type GetChatSessionQueryVariables,
} from "../graphql";

/**
 * SDK for chat session operations with error handling
 */
export const chatSessionSdkV2 = {
  /**
   * Get a chat session by ID
   */
  get: async (
    vars: GetChatSessionQueryVariables
  ): Promise<GetChatSessionQuery> => {
    try {
      return await graphqlClient.request(GetChatSessionDocument, vars);
    } catch (error) {
      console.error(`Error fetching chat session with ID ${vars.id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new chat session
   */
  create: async (
    vars: CreateChatSessionMutationVariables
  ): Promise<CreateChatSessionMutation> => {
    try {
      return await graphqlClient.request(CreateChatSessionDocument, vars);
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  },

  /**
   * Update an existing chat session
   */
  update: async (
    vars: UpdateChatSessionMutationVariables
  ): Promise<UpdateChatSessionMutation> => {
    try {
      return await graphqlClient.request(UpdateChatSessionDocument, vars);
    } catch (error) {
      console.error("Error updating chat session:", error);
      throw error;
    }
  },

  /**
   * Delete a chat session
   */
  delete: async (id: string): Promise<DeleteChatSessionMutation> => {
    try {
      return await graphqlClient.request(DeleteChatSessionDocument, { id });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      throw error;
    }
  },
};
