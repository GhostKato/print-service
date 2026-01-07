import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/api/cloudinary'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { useLoaderStore } from './loader'
import { notificationStore } from './notifications'
import { useI18n } from 'vue-i18n'
import type { Card } from '@/types'

export const useCardStore = defineStore('card', () => {
  const loader = useLoaderStore()
  const { t } = useI18n()
  const cards = ref<Card[]>([])

  const initCardsListener = () => {
    const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      cards.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Card)
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
        createdAt: serverTimestamp(),
      })
      notificationStore.success(t('common.success'))
    } catch (error) {
      console.error('Add card error:', error)
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  const editCard = async (
    id: string,
    updates: Partial<Card>,
    file?: File,
    currentImageUrl?: string,
  ) => {
    loader.showLoader()
    try {
      const cardRef = doc(db, 'cards', id)
      const cardSnap = await getDoc(cardRef)
      if (!cardSnap.exists()) throw new Error('Card not found')
      const cardData = cardSnap.data() as Card

      let imageUrl = currentImageUrl || cardData.imageUrl || ''

      if (file) {
        if (imageUrl) await deleteImageFromCloudinary(imageUrl)
        imageUrl = await uploadImageToCloudinary(file)
      }

      await updateDoc(cardRef, {
        ...updates,
        imageUrl,
        updatedAt: serverTimestamp(),
      })

      notificationStore.success(t('common.success'))
    } catch (error) {
      console.error('Edit card error:', error)
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  const deleteCard = async (id: string, imageUrl?: string) => {
    if (!confirm(t('common.confirm_delete'))) return
    loader.showLoader()
    try {
      if (imageUrl) await deleteImageFromCloudinary(imageUrl)
      await deleteDoc(doc(db, 'cards', id))
      notificationStore.success(t('common.deleted'))
    } catch (error) {
      console.error('Delete card error:', error)
      notificationStore.error(t('common.error'))
    } finally {
      loader.hideLoader()
    }
  }

  return { cards, initCardsListener, addCard, editCard, deleteCard }
})
