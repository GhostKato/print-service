import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import * as FirebaseAPI from '@/api/auth'
import * as FirestoreAPI from '@/api/users'
import { useLoaderStore } from '@/stores/loader'
import { notificationStore } from './notifications'
import { useI18n } from 'vue-i18n'
import type { AppUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<AppUser | null>(null)
  const isLoaded = ref(false)

  const loaderStore = useLoaderStore()
  const { t } = useI18n()
  const error = ref<string | null>(null)
  const mode = ref<'login' | 'register' | 'edit'>('login')

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isModerator = computed(() => profile.value?.role === 'moderator')
  const isStaff = computed(() => isAdmin.value || isModerator.value)

  const register = async (nickname: string, email: string, password: string) => {
    loaderStore.showLoader()
    error.value = null
    try {

      const u = await FirebaseAPI.register(nickname, email, password)
      user.value = u
      await FirestoreAPI.createUserDoc(u.uid, email, nickname)
      profile.value = await FirestoreAPI.getUserDoc(u.uid)
      notificationStore.success(t('notification_message.register_success'))
      notificationStore.info(t('notification_message.user_collection_info'))
    } catch {
      notificationStore.error(t('notification_message.register_error'))
    } finally {
      loaderStore.hideLoader()
    }
  }

  const login = async (email: string, password: string) => {
    loaderStore.showLoader()
    error.value = null
    try {
      const u = await FirebaseAPI.login(email, password)
      user.value = u
      profile.value = await FirestoreAPI.getUserDoc(u.uid)
      notificationStore.success(t('notification_message.login_success'))
      notificationStore.info(t('notification_message.user_collection_info'))
    } catch {
      notificationStore.error(t('notification_message.login_error'))
    } finally {
      loaderStore.hideLoader()
    }
  }

  const logout = async () => {
    loaderStore.showLoader()
    error.value = null
    try {
      await FirebaseAPI.logout()
      user.value = null
      profile.value = null
      notificationStore.success(t('notification_message.logout_success'))
      notificationStore.info(t('notification_message.guest_collection_info'))
    } catch {
      notificationStore.error(t('notification_message.logout_error'))
    } finally {
      loaderStore.hideLoader()
    }
  }

  const updateProfile = async (updates: FirebaseAPI.ProfileUpdates) => {
    if (!user.value) return
    loaderStore.showLoader()
    try {
      const updatedUser = await FirebaseAPI.updateUserProfile(updates)
      user.value = updatedUser
      if (updates.displayName) {
      }
      notificationStore.success(t('notification_message.updated_profile_success'))
    } catch {
      notificationStore.error(t('notification_message.updated_profile_error'))
    } finally {
      loaderStore.hideLoader()
    }
  }

  const initAuthListener = () => {
    onAuthStateChanged(auth, async (u) => {
      user.value = u
      if (u) {
        profile.value = await FirestoreAPI.getUserDoc(u.uid)
      } else {
        profile.value = null
      }
      isLoaded.value = true 
    })
  }

  return {
    user, profile, isAdmin, isModerator, isStaff, isLoaded,
    error, mode, register, login, logout, updateProfile,
    setMode: (m: any) => mode.value = m,
    initAuthListener
  }
})
