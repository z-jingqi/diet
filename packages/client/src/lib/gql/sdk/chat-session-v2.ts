import { graphqlClient } from "../client";
import {
  CreateChatSessionDocument,
  UpdateChatSessionDocument,
  DeleteChatSessionDocument,
  type CreateChatSessionMutationVariables,
  type UpdateChatSessionMutationVariables,
  type CreateChatSessionMutation,
  type UpdateChatSessionMutation,
  type DeleteChatSessionMutation,
} from "../graphql";

/**
 * SDK for chat session operations with error handling
 */
export const chatSessionSdkV2 = {
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

  delete: async (id: string): Promise<DeleteChatSessionMutation> => {
    try {
      return await graphqlClient.request(DeleteChatSessionDocument, { id });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      throw error;
    }
  },
};
