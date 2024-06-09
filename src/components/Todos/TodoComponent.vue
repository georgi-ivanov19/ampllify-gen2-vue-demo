<script setup lang="ts">
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'
import { ref } from 'vue'

type Todo = Schema['Todo']['type']

const props = defineProps<{
  todo: Todo
}>()

const dataTodo = ref(props.todo)
const editing = ref(false)
const loading = ref(false)

const client = generateClient<Schema>()

const updateTodo = async () => {
  loading.value = true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _updatedTodo, errors } = await client.models.Todo.update(
    {
      id: props.todo.id,
      content: dataTodo.value.content,
      isDone: dataTodo.value.isDone
    }
  )
  if (errors) {
    console.error(errors)
    return
  }
  editing.value = false
  loading.value = false
}

const deleteTodo = async () => {
  loading.value = true
  const { errors } = await client.models.Todo.delete(
    { id: props.todo.id }
  )
  if (errors) {
    console.error(errors)
    return
  }
  loading.value = false
}
</script>

<template>
  <div class="todo">
    <input type="checkbox" v-model="dataTodo.isDone" @change="updateTodo" />
    <span v-if="!editing" :class="{ done: dataTodo.isDone }">{{ dataTodo.content }}</span>
    <input v-else type="text" :disabled="loading" v-model="dataTodo.content" />
    <button v-if="!dataTodo.isDone && !editing" :disabled="loading" @click="editing = !editing">
      Edit
    </button>
    <button v-if="!editing" :disabled="loading" @click="deleteTodo">Delete</button>
    <button v-if="editing" :disabled="loading" @click="updateTodo">Save</button>
  </div>
</template>

<style scoped>
.todo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.done {
  text-decoration: line-through;
}
</style>
