<script setup lang="ts">
import TodosForm from '../components/Todos/TodoForm.vue'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
import { ref, onMounted, onUnmounted } from 'vue'
import TodoComponent from '@/components/Todos/TodoComponent.vue'
type Todo = Schema['Todo']['type']

const client = generateClient<Schema>()
const userTodos = ref<Todo[]>([])
const loding = ref(false)

// Subscribe to creation of Todo
const createSub = client.models.Todo.onCreate().subscribe({
  next: (data) => {
    console.log('New Todo:', data)
    userTodos.value = [data, ...userTodos.value]
  },
  error: (error) => console.warn(error)
})

const deleteSub = client.models.Todo.onDelete().subscribe({
  next: (data) => {
    console.log('Deleted Todo:', data)
    userTodos.value = userTodos.value.filter((todo) => todo.id !== data.id)
  },
  error: (error) => console.warn(error)
})

// Subscribe to update of Todo
const updateSub = client.models.Todo.onUpdate().subscribe({
  next: (data) => {
    console.log('Updated Todo:', data)
    userTodos.value = userTodos.value.map((todo) => (todo.id === data.id ? data : todo))
  },
  error: (error) => console.warn(error)
})

const fetchTodos = async () => {
  loding.value = true
  const { data: todos, errors } = await client.models.Todo.list()
  if (errors) {
    console.error(errors)
    return
  }
  console.log(todos)
  userTodos.value = todos
  loding.value = false
}

onMounted(fetchTodos)
onUnmounted(() => {
  createSub.unsubscribe()
  deleteSub.unsubscribe()
  updateSub.unsubscribe()
})
</script>

<template>
  <div class="about">
    <h1>TODOs:</h1>
    <div v-if="loding">Loading...</div>
    <div v-else>
      <div v-for="todo in userTodos" :key="todo.id">
        <TodoComponent :todo="todo" />
      </div>
    </div>
    <TodosForm />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    row-gap: 1rem;
  }
}
</style>
