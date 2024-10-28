<script setup>
import { ref } from 'vue'
import QuotaManager from './components/QuotaManager.vue'
import { API_URL, API_STATUS_OK, INITIAL_USER_QUOTA, MIN_QUOTA, MAX_QUOTA } from './config'

const currentQuota = ref(INITIAL_USER_QUOTA)
const isVisibleQuotaManager = ref(false)
const isLoading = ref(false)
const systemMessage = ref('')

const showQuotaManager = () => {
  isVisibleQuotaManager.value = true
}

const displaySystemMessage = (message, timeout = 6000) => {
  systemMessage.value = message
  setTimeout(() => {
    systemMessage.value = ''
  }, timeout)
}

const updateQuota = async (newQuota, reason) => {
  if (newQuota < MIN_QUOTA || newQuota > MAX_QUOTA) {
    displaySystemMessage('Invalid quota value')
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`${API_URL}/${API_STATUS_OK}`, {
      method: 'POST',
      body: JSON.stringify({ newQuota, reason }),
    })

    if (response.ok) {
      displaySystemMessage('Quota updated successfully', 6000)
      currentQuota.value = newQuota
      isVisibleQuotaManager.value = false
    } else {
      throw new Error('Failed to update quota')
    }
  } catch (error) {
    displaySystemMessage('Error updating quota')
  } finally {
    isLoading.value = false
  }
}

const closeQuotaManager = () => {
  isVisibleQuotaManager.value = false
}
</script>

<template>
  <header>
    <div class="container">
      <h1>Flight Subscription Manager</h1>
      <p>Initially set to {{ INITIAL_USER_QUOTA }} flights.</p>
      <p>
        <strong>{{ currentQuota }}</strong> flights left
      </p>
    </div>
  </header>
  <main class="container">
    <article v-if="systemMessage" class="system-message">
      {{ systemMessage }}
    </article>
    <p>
      <button class="primary" @click="showQuotaManager">Edit flights</button>
    </p>
    <QuotaManager
      :quota="currentQuota"
      :max-quota="MAX_QUOTA"
      :min-quota="MIN_QUOTA"
      :show="isVisibleQuotaManager"
      :is-loading="isLoading"
      @save="updateQuota"
      @close="closeQuotaManager"
    />
  </main>
</template>
