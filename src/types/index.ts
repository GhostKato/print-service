import { Timestamp } from 'firebase/firestore'


export type UserRole = 'admin' | 'moderator' | 'user'

export interface AppUser {
  id: string
  email: string
  role: UserRole
  displayName?: string
  createdAt: Timestamp
}


export interface Chat {
  id: string
  userId: string
  userName: string
  lastMessage: string
  updatedAt: Timestamp
  isRead: boolean
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  text: string
  createdAt: Timestamp
  isRead: boolean
}


export interface Card {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  createdAt: Timestamp
}

export interface News {
  id: string
  title: string
  content: string
  imageUrl?: string
  published: boolean
  createdAt: Timestamp
}


export interface Feedback {
  id: string
  userId?: string
  email: string      
  message: string
  createdAt: Timestamp
}
