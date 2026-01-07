import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase'
import { uploadImageToCloudinary } from '@/api/cloudinary'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { useLoaderStore } from './loader'
import { notificationStore } from './notifications'
import { useI18n } from 'vue-i18n'
import type { News } from '@/types'

export const useNewsStore = defineStore('news', () => {
  const loader = useLoaderStore()
  const { t } = useI18n()

  const news = ref<News[]>([])

  const initNewsListener = () => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      news.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as News)
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
        createdAt: serverTimestamp(),
      })
      notificationStore.success(t('common.success'))
    } catch {
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  const deleteNews = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return
    loader.showLoader()
    try {
      await deleteDoc(doc(db, 'news', id))
      notificationStore.success(t('common.deleted'))
    } catch {
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  return {
    news,
    initNewsListener,
    addNews,
    deleteNews,
  }
})
