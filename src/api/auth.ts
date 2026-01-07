import { auth, db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { updateProfile as fbUpdateProfile } from 'firebase/auth'

// Registration
export const register = async (
  nickname: string,
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: nickname })
  }
  return userCredential.user
}

// Login
export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// Logout
export const logout = async () => {
  await signOut(auth)
}

// Profile update
export interface ProfileUpdates {
  displayName?: string
  email?: string
  password?: string
  currentPassword: string
}

export const updateUserProfile = async (updates: ProfileUpdates) => {
  const user = auth.currentUser
  if (!user) throw new Error('No user logged in')
  if (!updates.currentPassword) {
    throw new Error('Current password is required')
  }

  const credential = EmailAuthProvider.credential(user.email!, updates.currentPassword)
  await reauthenticateWithCredential(user, credential)

  const firestoreUpdates: Record<string, any> = {}

  if (updates.displayName) {
    await fbUpdateProfile(user, { displayName: updates.displayName })
    firestoreUpdates.displayName = updates.displayName
  }

  if (updates.email) {
    await verifyBeforeUpdateEmail(user, updates.email)
    firestoreUpdates.email = updates.email
  }

  if (updates.password) {
    await updatePassword(user, updates.password)
  }

  if (Object.keys(firestoreUpdates).length > 0) {
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, firestoreUpdates)
  }

  return auth.currentUser
}
