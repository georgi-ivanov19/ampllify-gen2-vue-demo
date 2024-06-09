<script setup lang="ts">
import { ref } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()
const content = ref('')
const loading = ref(false)

const addTodo = async () => {
  if (content.value.trim() === '') return

  const todo = {
    content: content.value,
    isDone: false
  }
  loading.value = true
  const { errors, data: newTodo } = await client.models.Todo.create(todo)
  if (errors) {
    console.error(errors)
    return
  }
  console.log(newTodo)
  loading.value = false
  content.value = ''
}
</script>

<template>
  <div class="todo-form">
    <form @submit.prevent>
      <input v-model="content" type="text" placeholder="Add a new todo" />
      <button type="button" @click="addTodo">Add</button>
    </form>
  </div>
</template>
