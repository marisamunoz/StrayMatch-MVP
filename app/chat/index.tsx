import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { sendChatMessage } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you with the animal you found. First, let me ask - is the animal injured or in immediate danger?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    createChatSession();
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const createChatSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: user.id,
          messages: [messages[0]],
        },
      ])
      .select()
      .single();

    if (data) {
      setSessionId(data.id);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    if (messages.length === 1) { 
      setShowQuickActions(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendChatMessage(
        updatedMessages.map(m => ({
          role: m.role,
          content: m.content,
        }))
      );

      const shouldTransition = aiResponse.includes('{') && aiResponse.includes('"species"');
      
      let displayMessage = aiResponse;
      let extractedData = null;

      if (shouldTransition) {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
          displayMessage = aiResponse.replace(/\{[\s\S]*\}/, '').trim();
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: displayMessage,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      if (sessionId) {
        await supabase
          .from('chat_sessions')
          .update({ 
            messages: finalMessages,
            context: extractedData,
          })
          .eq('id', sessionId);
      }

      if (extractedData) {
        setTimeout(() => {
          router.push({
            pathname: '/report-animal',
            params: extractedData,
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    sendMessage(actionText);
  };

  const goToReportForm = () => {
    router.push('/report-animal');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.aiIndicator}>
            <View style={styles.aiDot} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.headerSubtitle}>Here to help • Available 24/7</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {showQuickActions && messages.length === 1 && (
          <>
            <View style={styles.welcomeContainer}>
              <Ionicons name="chatbubbles" size={50} color={Colors.primary} />
              <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
              <Text style={styles.welcomeText}>
                I'm here to help you with stray animals. Choose a quick action to start, or just type your question below.
              </Text>
            </View>

            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('I found a stray dog')}
                >
                  <Ionicons name="paw" size={24} color={Colors.primary} />
                  <Text style={styles.quickActionText}>Found a dog</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('I found a stray cat')}
                >
                  <Ionicons name="paw" size={24} color={Colors.secondary} />
                  <Text style={styles.quickActionText}>Found a cat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('The animal needs medical attention')}
                >
                  <Ionicons name="medical" size={24} color={Colors.danger} />
                  <Text style={styles.quickActionText}>Medical help</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('Where can I take this animal?')}
                >
                  <Ionicons name="location" size={24} color={Colors.success} />
                  <Text style={styles.quickActionText}>Where to take?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('I want to become a foster')}
                >
                  <Ionicons name="heart" size={24} color="#EC4899" />
                  <Text style={styles.quickActionText}>Foster info</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={goToReportForm}
                >
                  <Ionicons name="document-text" size={24} color={Colors.textSecondary} />
                  <Text style={styles.quickActionText}>Skip to form</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Chat Messages */}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.assistantAvatar}>
                <Ionicons name="sparkles" size={16} color={Colors.primary} />
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <View style={styles.assistantAvatar}>
              <Ionicons name="sparkles" size={16} color={Colors.primary} />
            </View>
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}
        
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          maxLength={500}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={Colors.card} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.card,
    ...Shadows.sm,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  quickActionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    ...Shadows.sm,
  },
  assistantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  userText: {
    color: Colors.card,
  },
  assistantText: {
    color: Colors.text,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
});
