<template>
  <Form
    class="form-container"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="onSubmit"
  >
    <div class="field-container" v-if="authStore.mode !== 'login'">
      <label class="label">{{ $t('form.label_nickname') }}</label>
      <Field class="field" name="nickname" type="text" />
      <ErrorMessage name="nickname" class="error" />
    </div>

    <div class="field-container">
      <label class="label">{{ $t('form.label_email') }}</label>
      <Field class="field" name="email" type="email" />
      <ErrorMessage name="email" class="error" />
    </div>

    <div class="field-container">
      <label class="label">{{ $t('form.label_password') }}</label>
      <Field class="field" name="password" type="password" />
      <ErrorMessage name="password" class="error" />
    </div>

    <div class="field-container" v-if="authStore.mode === 'edit'">
      <label class="label">{{ $t('form.label_current_password') }}</label>
      <Field class="field" name="currentPassword" type="password" />
      <ErrorMessage name="currentPassword" class="error" />
    </div>

    <IButton variant="form-submit-btn" type="submit" :disabled="loaderStore.isLoading">
      {{ submitBtnText }}
    </IButton>

    <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
  </Form>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import IButton from '../IButton/IButton.vue'
import { useLoaderStore } from '@/stores/loader'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const authStore = useAuthStore()
const modalStore = useModalStore()
const loaderStore = useLoaderStore()

const initialValues = computed(() => ({
  nickname: authStore.user?.displayName || '',
  email: authStore.user?.email || '',
  password: '',
  currentPassword: '',
}))

const schema = computed(() => {
  if (authStore.mode === 'register') {
    return yup.object({
      nickname: yup.string().required('Nickname is required').min(5).max(15),
      email: yup.string().required('Email is required').email().min(15).max(30),
      password: yup.string().required('Password is required').min(6).max(30),
    })
  } else if (authStore.mode === 'edit') {
    return yup.object({
      nickname: yup.string().min(5).max(15),
      email: yup.string().email().min(15).max(30),
      password: yup.string().min(6).max(30),
      currentPassword: yup.string().required('Current password is required').min(6).max(30),
    })
  } else {
    return yup.object({
      email: yup.string().required('Email is required').email().min(15).max(30),
      password: yup.string().required('Password is required').min(6).max(30),
    })
  }
})

const onSubmit = async (values: any) => {
  loaderStore.showLoader()
  try {
    if (authStore.mode === 'register') {
      await authStore.register(values.nickname, values.email, values.password)
    } else if (authStore.mode === 'edit') {
      await authStore.updateProfile({
        displayName: values.nickname || undefined,
        email: values.email || undefined,
        password: values.password || undefined,
        currentPassword: values.currentPassword,
      })
    } else {
      await authStore.login(values.email, values.password)
    }
    if (!authStore.error) {
      modalStore.close('auth')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loaderStore.hideLoader()
  }
}
const submitBtnText = computed(() => {
  switch (authStore.mode) {
    case 'register':
      return t('form.btn_register')
    case 'edit':
      return t('form.btn_edit')
    default:
      return t('form.btn_login')
  }
})
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.field-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
  width: 100%;
  position: relative;
}
.field {
  background-color: var(--color-dark-grey);
  border: none;
  width: 100%;
  border-radius: 8px;
  height: 35px;
  color: var(--color-white);
  padding-left: 10px;
  padding-right: 10px;
}
.field:focus {
  outline: 1px solid var(--color-red);
}
.field:hover {
  outline: 1px solid var(--color-hover);
}
.error {
  position: absolute;
  top: 60px;
  color: var(--color-hover);
  font-size: 14px;
}
@media (min-width: 768px) {
  .label {
    font-size: 18px;
  }
  .field {
    height: 48px;
    font-size: 20px;
  }
  .error {
    top: 76px;
  }
}
</style>
