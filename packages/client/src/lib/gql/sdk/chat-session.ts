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

export const chatSessionSdk = {
  create: async (
    vars: CreateChatSessionMutationVariables
  ): Promise<CreateChatSessionMutation> =>
    graphqlClient.request(CreateChatSessionDocument, vars),

  update: async (
    vars: UpdateChatSessionMutationVariables
  ): Promise<UpdateChatSessionMutation> =>
    graphqlClient.request(UpdateChatSessionDocument, vars),

  delete: async (id: string): Promise<DeleteChatSessionMutation> =>
    graphqlClient.request(DeleteChatSessionDocument, { id }),
};
