import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, set, serverTimestamp, off } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://your-project.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

// Chat helpers
export const getChatRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_')
}

export const sendMessage = async (roomId, senderId, senderName, message) => {
  const messagesRef = ref(database, `chats/${roomId}/messages`)
  await push(messagesRef, {
    senderId,
    senderName,
    message,
    timestamp: serverTimestamp(),
    read: false
  })
}

export const subscribeToMessages = (roomId, callback) => {
  const messagesRef = ref(database, `chats/${roomId}/messages`)
  onValue(messagesRef, (snapshot) => {
    const messages = []
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      })
    })
    callback(messages)
  })
  return () => off(messagesRef)
}

export const setTypingStatus = async (roomId, userId, isTyping) => {
  const typingRef = ref(database, `chats/${roomId}/typing/${userId}`)
  await set(typingRef, isTyping ? serverTimestamp() : null)
}

export const subscribeToTyping = (roomId, userId, callback) => {
  const typingRef = ref(database, `chats/${roomId}/typing`)
  onValue(typingRef, (snapshot) => {
    const typingUsers = []
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.key !== userId && childSnapshot.val()) {
        typingUsers.push(childSnapshot.key)
      }
    })
    callback(typingUsers.length > 0)
  })
  return () => off(typingRef)
}

export const markMessagesAsRead = async (roomId, userId) => {
  const messagesRef = ref(database, `chats/${roomId}/messages`)
  onValue(messagesRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val()
      if (message.senderId !== userId && !message.read) {
        set(ref(database, `chats/${roomId}/messages/${childSnapshot.key}/read`), true)
      }
    })
  }, { onlyOnce: true })
}


