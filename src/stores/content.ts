import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as FirestoreAPI from '@/api/users'
import { db } from '@/firebase'
import { uploadImageToCloudinary } from '@/api/cloudinary'
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { useLoaderStore } from './loader'
import { notificationStore } from './notifications'
import { useI18n } from 'vue-i18n'
import type { Card, News } from '@/types'

export const useContentStore = defineStore('content', () => {
  const loader = useLoaderStore()
  const { t } = useI18n()

  const cards = ref<Card[]>([])
  const news = ref<News[]>([])

  const initCardsListener = () => {
    const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      cards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card))
    })
  }

  const addCard = async (title: string, description: string, price: number, file: File) => {
    loader.showLoader()
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      await addDoc(collection(db, 'cards'), {
        title,
        description,
        price,
        imageUrl,
        createdAt: serverTimestamp()
      })
      notificationStore.success(t('common.success'))
    } catch (e) {
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  const initNewsListener = () => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      news.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News))
    })
  }

  const addNews = async (title: string, content: string, file?: File) => {
    loader.showLoader()
    try {
      let imageUrl = ''
      if (file) {
        imageUrl = await uploadImageToCloudinary(file)
      }
      await addDoc(collection(db, 'news'), {
        title,
        content,
        imageUrl,
        published: true,
        createdAt: serverTimestamp()
      })
      notificationStore.success(t('common.success'))
    } catch {
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }
  const deleteContent = async (id: string, collectionName: 'cards' | 'news') => {
    if (!confirm(t('common.confirm_delete'))) return
    loader.showLoader()
    try {
      await deleteDoc(doc(db, collectionName, id))

      notificationStore.success(t('common.deleted'))
    } finally {
      loader.hideLoader()
    }
  }


  const submitFeedback = async (message: string, email?: string, uid?: string) => {
    if (!message.trim()) return
    loader.showLoader()
    try {
      await FirestoreAPI.sendFeedback(message, email, uid)
      notificationStore.success(t('notification_message.feedback_success'))
    } catch {
      notificationStore.error(t('notification_message.feedback_error'))
    } finally {
      loader.hideLoader()
    }
  }

  return {
    cards, news,
    initCardsListener, initNewsListener,
    addCard, addNews, deleteContent,
    submitFeedback
  }
})
