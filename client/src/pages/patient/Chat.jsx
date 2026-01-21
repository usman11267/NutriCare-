import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Check, CheckCheck, Users, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../config/supabase'
import { sendMessage, subscribeToMessages, getChatRoomId, setTypingStatus, subscribeToTyping } from '../../config/firebase'

const Chat = () => {
  const { user, profile } = useAuthStore()
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dietitians, setDietitians] = useState([])
  const [selectedDietitian, setSelectedDietitian] = useState(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch available dietitians
  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'dietitian')
          .order('name', { ascending: true })

        if (error) throw error
        setDietitians(data || [])
        
        // Auto-select first dietitian if available
        if (data && data.length > 0) {
          setSelectedDietitian(data[0])
        }
      } catch (error) {
        console.error('Error fetching dietitians:', error)
      }
    }

    fetchDietitians()
  }, [])

  const roomId = user?.id && selectedDietitian?.id 
    ? getChatRoomId(user.id, selectedDietitian.id) 
    : null

  useEffect(() => {
    if (!roomId) {
      setIsLoading(false)
      return
    }

    // Subscribe to messages
    const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
      setMessages(newMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      })))
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    if (!roomId || !selectedDietitian) return

    // Subscribe to typing status
    const unsubscribe = subscribeToTyping(roomId, selectedDietitian.id, (typing) => {
      setIsTyping(typing)
    })

    return () => unsubscribe && unsubscribe()
  }, [roomId, selectedDietitian])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTyping = () => {
    if (roomId && user?.id) {
      setTypingStatus(roomId, user.id, true)
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set typing to false after 2 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(roomId, user.id, false)
      }, 2000)
    }
  }

  const handleSend = async () => {
    if (!message.trim() || !roomId) return

    const userName = profile?.name || user?.email?.split('@')[0] || 'Patient'
    
    try {
      await sendMessage(roomId, user.id, userName, message.trim())
      setMessage('')
      setTypingStatus(roomId, user.id, false)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatDate = (date) => {
    const today = new Date()
    const messageDate = new Date(date)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getInitials = (name) => {
    if (!name) return 'NA'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Show dietitian selection if no dietitian is selected
  if (!selectedDietitian && dietitians.length === 0 && !isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Dietitians Available</h2>
          <p className="text-gray-400">Please check back later when a dietitian is available for consultation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dietitian Selector */}
      {dietitians.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-4 overflow-x-auto pb-2"
        >
          {dietitians.map(dietitian => (
            <button
              key={dietitian.id}
              onClick={() => setSelectedDietitian(dietitian)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedDietitian?.id === dietitian.id
                  ? 'bg-primary-500/20 border-2 border-primary-500'
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{getInitials(dietitian.name)}</span>
              </div>
              <span className="text-sm font-medium text-white">{dietitian.name}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center justify-between p-4 mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{getInitials(selectedDietitian?.name)}</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-850" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">{selectedDietitian?.name || 'Select a Dietitian'}</h2>
            <p className="text-sm text-green-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
            <span className="ml-2 text-gray-400">Loading messages...</span>
          </div>
        ) : !selectedDietitian ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a dietitian to start chatting</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>No messages yet.</p>
              <p className="text-sm">Start the conversation with {selectedDietitian?.name}!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === user?.id
            const showDate = index === 0 || 
              formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp)
          
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 bg-neutral-850 px-3 py-1 rounded-full">
                    {formatDate(msg.timestamp)}
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {!isOwn && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{getInitials(selectedDietitian?.name)}</span>
                    </div>
                  )}
                  <div className={`chat-bubble px-4 py-3 rounded-2xl ${
                    isOwn 
                      ? 'bg-primary-500 text-white rounded-br-sm' 
                      : 'bg-white/10 text-white rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                      <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                      {isOwn && (
                        msg.read 
                          ? <CheckCheck className="w-4 h-4 text-blue-300" />
                          : <Check className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })
        )}}

        {/* Typing Indicator */}
        {isTyping && selectedDietitian && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{getInitials(selectedDietitian?.name)}</span>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-1">
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mt-4 p-4"
      >
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              handleTyping()
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-colors"
          />
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Chat


