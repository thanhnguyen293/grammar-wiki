<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from './i18n'
import { useSync } from './sync'

const { available, user, status, lastSynced, errorCode, signIn, signOut, syncNow } = useSync()
const { tr } = useLocale()
const open = ref(false)
const root = ref<HTMLElement>()

const statusText = computed(() => {
  if (status.value === 'syncing') return tr('Đang đồng bộ…')
  if (status.value === 'error') return tr('Lỗi đồng bộ ({c})', { c: errorCode.value })
  if (lastSynced.value) {
    const t = new Date(lastSynced.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return tr('Đã đồng bộ lúc {t}', { t })
  }
  return tr('Đang kết nối…')
})

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (open.value = false)
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="available" ref="root" class="sync">
    <button
      v-if="!user"
      type="button"
      class="sync-btn"
      :class="{ error: status === 'error' }"
      :disabled="status === 'signing-in'"
      :title="status === 'error' ? statusText : tr('Đăng nhập Google để đồng bộ tiến độ giữa các máy')"
      @click="signIn"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4.25 4.25 0 0 1-.5 8.47V17H7z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
      </svg>
      <span class="sync-label">{{ tr(status === 'signing-in' ? 'Đang đăng nhập…' : 'Đồng bộ') }}</span>
    </button>
    <template v-else>
      <button
        type="button"
        class="sync-avatar"
        :class="status"
        :aria-label="tr('Tài khoản và đồng bộ')"
        :aria-expanded="open"
        @click="open = !open"
      >
        <img v-if="user.photo" :src="user.photo" alt="" referrerpolicy="no-referrer" />
        <span v-else>{{ (user.name || user.email).slice(0, 1).toUpperCase() }}</span>
        <i class="sync-dot" />
      </button>
      <div v-if="open" class="sync-panel" role="dialog" :aria-label="tr('Tài khoản và đồng bộ')">
        <p class="sync-name">{{ user.name }}</p>
        <p class="sync-email">{{ user.email }}</p>
        <p class="sync-status" :class="status">{{ statusText }}</p>
        <p class="sync-note">{{ tr('Tiến độ, Hôm nay học, Từ của tôi và lịch sử ôn tập được lưu vào tài khoản này.') }}</p>
        <div class="sync-actions">
          <button type="button" class="vbtn" :disabled="status === 'syncing'" @click="syncNow">{{ tr('Đồng bộ ngay') }}</button>
          <button type="button" class="vbtn" @click="(open = false), signOut()">{{ tr('Đăng xuất') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>
