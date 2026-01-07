import { db } from '@/firebase'
import {
  doc, setDoc, getDoc, getDocs, collection, query, where,
  orderBy, onSnapshot, serverTimestamp, addDoc, updateDoc
} from 'firebase/firestore'
import type { AppUser, Chat, Message, UserRole } from '@/types'

export const createUserDoc = async (uid: string, email: string, name: string) => {
  await setDoc(doc(db, 'users', uid), {
    email,
    displayName: name,
    role: 'user',
    createdAt: serverTimestamp(),
  })
}

export const getUserDoc = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } as AppUser : null
}

export const getAllUsers = async (): Promise<AppUser[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as AppUser[];
}

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role: newRole });
}

export const subscribeToChats = (role: UserRole, uid: string, callback: (chats: Chat[]) => void) => {
  const q = (role === 'admin' || role === 'moderator')
    ? query(collection(db, 'chats'), orderBy('updatedAt', 'desc'))
    : query(collection(db, 'chats'), where('userId', '==', uid))

  return onSnapshot(q, (snapshot) => {

    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[]
    callback(chats)
  })
}

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
  });
}

export const sendMessage = async (chatId: string, senderId: string, text: string, userName?: string) => {
  await addDoc(collection(db, 'messages'), {
    chatId,
    senderId,
    text,
    isRead: false,
    createdAt: serverTimestamp()
  })

  await setDoc(doc(db, 'chats', chatId), {
    userId: chatId,
    userName: userName || 'Гість',
    lastMessage: text,
    updatedAt: serverTimestamp(),
    isRead: false
  }, { merge: true })
}

export const markChatAsRead = async (chatId: string) => {
  await updateDoc(doc(db, 'chats', chatId), {
    isRead: true
  })
}

export const sendFeedback = async (text: string, email?: string, uid?: string) => {
  await addDoc(collection(db, 'feedback'), {
    message: text,
    email: email || 'Анонім',
    userId: uid || null,
    createdAt: serverTimestamp()
  })
}
