<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  maxQuota: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  minQuota: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  quota: {
    type: Number,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

// if minQuota > maxQuota, swap them
const [minQuota, maxQuota] = [props.minQuota, props.maxQuota].sort()

const emit = defineEmits(['save', 'close'])

const dialogRef = ref(null)
const selectedReason = ref('')
const currentQuota = ref(props.quota)

const currentQuotaIsTheSame = computed(() => {
  return currentQuota.value === props.quota
})

const isIncreasingQuota = computed(() => {
  return currentQuota.value > props.quota
})

const addReasons = [
  'Subscriber canceled flight',
  'Airline canceled flight',
  'Customer compensation',
  'Other',
]

const reduceReasons = [
  'Flight not redeposited after a flight cancellation',
  'Subscriber had log in or password issues',
  'Subscriber had issues when booking',
  'Subscription has not renewed correctly',
  'Other',
]

const availableReasons = computed(() => {
  return currentQuotaIsTheSame.value ? [] : isIncreasingQuota.value ? addReasons : reduceReasons
})

const isValid = computed(() => {
  return (
    !currentQuotaIsTheSame.value &&
    selectedReason.value &&
    currentQuota.value >= minQuota &&
    currentQuota.value <= maxQuota
  )
})

const resetForm = () => {
  currentQuota.value = props.quota
  selectedReason.value = ''
}

const showDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal()
    // focus the quantity input
    dialogRef.value.querySelector('#quota')?.focus()
  }
}

const closeDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.close()
    resetForm()
    emit('close')
  }
}

watchEffect(() => props.show ? showDialog() : closeDialog())

const handleSave = () => {
  emit('save', currentQuota.value, selectedReason.value)
}
</script>

<template>
  <dialog ref="dialogRef" class="quota-manager" @close="closeDialog">
    <article>
      <header>
        <button
          class="close-button"
          aria-label="Close dialog"
          rel="prev"
          @click="closeDialog"
        ></button>
        <h3>Edit flights</h3>
      </header>
      <div class="quota-manager__controls">
        <label for="quota">
          Flights left
          <input
            id="quota"
            type="number"
            v-model="currentQuota"
            :max="maxQuota"
            :min="minQuota"
            required
          />
        </label>
        <label v-if="!currentQuotaIsTheSame" for="reason">
          Reason to {{ isIncreasingQuota ? 'add' : 'reduce' }}
          <select id="reason" v-model="selectedReason" required>
            <option value="">What is the motive</option>
            <option v-for="reason in availableReasons" :key="reason" :value="reason">
              {{ reason }}
            </option>
          </select>
        </label>
      </div>
      <footer class="dialog-footer">
        <button type="button" :aria-busy="isLoading" :disabled="!isValid" @click="handleSave">
          Save
        </button>
      </footer>
    </article>
  </dialog>
</template>

<style>
.quota-manager {
  .quota-manager__controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      margin-bottom: 0;

      input {
        margin-bottom: 0;
      }
    }
  }

  .dialog-footer {
    button {
      margin-bottom: 0;
    }
  }
}
</style>
