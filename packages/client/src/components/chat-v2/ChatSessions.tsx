import { useEffect } from 'react';
import { ChatSession } from '@/lib/gql/graphql';
import { useChatSessionsV2 } from '@/lib/gql/hooks/chat-v2';
import useChatSessionStoreV2 from '@/store/chat-session-store-v2';
import useAuthStore from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Trash2, Pencil } from 'lucide-react';
import { useConfirmDialog } from '@/components/providers/ConfirmDialogProvider';
import { formatRelativeTimeV2 } from '@/utils/time-utils-v2';

interface ChatSessionsV2Props {
  onSelectSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
  onCloseSidebar?: () => void;
}

const ChatSessionsV2 = ({ 
  onSelectSession, 
  onCreateNewSession,
  onCloseSidebar
}: ChatSessionsV2Props) => {
  const confirm = useConfirmDialog();
  const { isAuthenticated, isGuestMode } = useAuthStore();
  
  // Session state
  const { 
    currentSessionId, 
    createTemporarySession, 
    switchSession, 
    deleteSession,
    renameSession
  } = useChatSessionStoreV2();
  
  // Fetch sessions from API
  const { sessions, isLoading, refetch } = useChatSessionsV2();
  
  // Refresh sessions list when auth state changes
  useEffect(() => {
    if (isAuthenticated && !isGuestMode) {
      refetch();
    }
  }, [isAuthenticated, isGuestMode, refetch]);
  
  // Handle creating new session
  const handleNewSession = () => {
    createTemporarySession();
    onCreateNewSession?.();
    onCloseSidebar?.();
  };
  
  // Handle selecting a session
  const handleSelectSession = (sessionId: string) => {
    switchSession(sessionId);
    onSelectSession?.(sessionId);
    onCloseSidebar?.();
  };
  
  // Handle renaming a session
  const handleRenameSession = async (sessionId: string) => {
    const newTitle = prompt('Enter new title for this conversation:');
    if (newTitle?.trim()) {
      await renameSession(sessionId, newTitle);
    }
  };
  
  // Handle deleting a session
  const handleDeleteSession = async (sessionId: string) => {
    const confirmed = await confirm({
      title: 'Delete conversation',
      description: 'Are you sure you want to delete this conversation? This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmVariant: 'destructive'
    });
    
    if (confirmed) {
      await deleteSession(sessionId);
      
      // If deleted the current session, create a new temporary one
      if (sessionId === currentSessionId) {
        createTemporarySession();
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* New chat button */}
      <div className="p-4 border-b">
        <Button 
          variant="default" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleNewSession}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>
      
      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => (
              <li key={session.id}>
                <div 
                  className={`
                    flex items-center justify-between p-2 rounded-md cursor-pointer
                    ${session.id === currentSessionId ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}
                  `}
                  onClick={() => session.id && handleSelectSession(session.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare size={16} className="flex-shrink-0" />
                    <div className="truncate flex-1">
                      {session.title || "New Chat"}
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {formatRelativeTimeV2(new Date(session.updatedAt || session.createdAt))}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (session.id) {
                          handleRenameSession(session.id);
                        }
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (session.id) {
                          handleDeleteSession(session.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Guest mode notice */}
      {isGuestMode && (
        <div className="p-4 text-center border-t">
          <p className="text-xs text-gray-500">
            Guest mode: Conversations aren't saved.{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Login
            </a>{" "}
            to save your conversations.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatSessionsV2; 
