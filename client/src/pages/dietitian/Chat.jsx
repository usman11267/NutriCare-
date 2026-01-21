import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Search, Phone, Video, MoreVertical, Check, CheckCheck, Circle, Loader2, Users } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../config/supabase'
import { sendMessage, subscribeToMessages, getChatRoomId, setTypingStatus } from '../../config/firebase'

const DietitianChat = () => {
  const { user, profile } = useAuthStore()
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient')
          .order('name', { ascending: true })

        if (error) throw error
        
        const processedPatients = (data || []).map(patient => ({
          id: patient.id,
          name: patient.name || 'Unknown',
          email: patient.email,
          avatar: patient.name ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'NA',
          status: 'online', // In real app, track online status
          lastMessage: '',
          lastMessageTime: '',
          unread: 0
        }))
        
        setPatients(processedPatients)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Subscribe to messages when patient is selected
  useEffect(() => {
    if (!selectedPatient || !user?.id) return

    const roomId = getChatRoomId(user.id, selectedPatient.id)
    
    const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
      setMessages(newMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      })))
    })

    return () => unsubscribe()
  }, [selectedPatient, user?.id])

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!message.trim() || !selectedPatient || !user?.id) return
    
    const roomId = getChatRoomId(user.id, selectedPatient.id)
    const userName = profile?.name || user?.email?.split('@')[0] || 'Dietitian'
    
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

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Patients Yet</h2>
          <p className="text-gray-400">Patients will appear here once they register.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-200px)] flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
      {/* Patient List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 card flex flex-col"
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display text-lg font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 text-left ${
                selectedPatient?.id === patient.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{patient.avatar}</span>
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-850 ${
                  patient.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white truncate">{patient.name}</span>
                  <span className="text-xs text-gray-500">{patient.lastMessageTime}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{patient.lastMessage}</p>
              </div>
              {patient.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                  {patient.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 card flex flex-col"
      >
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{selectedPatient.avatar}</span>
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-neutral-850 ${
                    selectedPatient.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedPatient.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{selectedPatient.status}</p>
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        isOwn 
                          ? 'bg-primary-500 text-white rounded-br-sm' 
                          : 'bg-white/10 text-white rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                          {isOwn && <CheckCheck className="w-4 h-4 text-blue-300" />}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Circle className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DietitianChat


