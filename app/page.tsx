"use client";

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

   function listTodos() {
    try {
     client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
      console.log(fetch)
    } catch (error) {
    console.log(error)
    }
   
  }

  useEffect(() => {
    listTodos();
  }, []);

async  function createTodo() {
  try {
     await client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  } catch (e) {
    /* handle error */
  console.log(e)
  }
  
  }
async function updateTodo(id: string) {
  try {
    await client.models.Todo.update({
      id,
      content: window.prompt("Todo content"),
    });
  } catch (e) {
    /* handle error */
    console.log(e)
  }
}
  
 async  function deleteTodo(id: string) {
    try {
        console.log(id)
  await  client.models.Todo.delete({ id })
    } catch (e) {
      /* handle error */
      console.log(e)
    }
  
  }

  return (
    <Authenticator>
   {({ signOut, user }) =>
    <main>
      <h1>{user?.signInDetails?.loginId} 'todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>

      <button onClick={signOut}>Sign out</button>
    </main>
      }
    </Authenticator>
  );
}
