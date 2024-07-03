"use client";

import { Alert, Authenticator, Button, Divider, Flex, Heading, Loader, SearchField } from '@aws-amplify/ui-react'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errr, setEr] = useState("")
const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Array<Schema["Category"]["type"]>>()

   function listTodos() {
     setEr("")
    try {
     client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    } catch (error:any) {
     setEr(error)
      console.log(error,2)
    }finally{
      setIsLoading(false)
    }
   
  }

  useEffect(() => {
    listTodos();
  }, [todos]);

async  function createTodo() {
    setEr("")
  setIsLoading(true)
  try { 
   await client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  } catch (e:any) {
    /* handle error */
  console.log(e,1)
      setEr(e)
  }finally{
    listTodos()
  }
}
 function createCategory() {
    try {
      client.models.Category.create({
        name: window.prompt("Category name"),
        description: window.prompt("Category description"),
      });
    } catch (e) {
      console.log(e)
    }
  }


async function updateTodo(id: string) {
     setEr("")
    setIsLoading(true)
  try {
    await client.models.Todo.update({
      id,
      content: window.prompt("Todo content"),
    });
  } catch (e:any) {
    /* handle error */
    console.log(e,3)
    setEr(e)
  }finally{
    listTodos()
    }
}

const searchTasks = async (e:any) => {
     setEr("")
    setSearch(e.target.value)
    if (e.target.value ==="") {
      listTodos()
    }else{
  try {
     const res = await client.models.Todo.list({
      filter: {
        content: {
          contains: search,
        },
      },
    });
      setTodos(res.data)
      console.log(res.data)
  } catch (e:any) {
    /* handle error */
    console.log(e,4)
        setEr(e)
  }
    }
};

  const ClearInput=()=>{
    setSearch("")
    listTodos()
    
  }

 async  function deleteTodo(id: string) {
   setEr("")
   setIsLoading(true)
    try {
      await  client.models.Todo.delete({ id })
    } catch (e:any) {
      /* handle error */
    setEr(e)
    }finally{
     listTodos()
    }
  }


   return (
    <Authenticator>
   {({ signOut, user }) =>
    <main>
          {errr!=="" &&
      <Alert isDismissible={true} variation='error'>{errr}</Alert>}
       <Heading isTruncated={true} level={1}>{user?.signInDetails?.loginId}'s todos</Heading>
         <Divider orientation='horizontal' />
        

        
          <SearchField placeholder="Search"  label="Search"  onChange={searchTasks} onClear={ClearInput} style={{backgroundColor:"white"}}/>
  <Flex direction="column">
            <Flex>
              <Button onClick={createCategory}>+ new category</Button>
            </Flex>
          <ul >

             {todos.map((todo) => (
              <li key={todo.id} style={{ display: "flex", flexDirection: "column", gap: "1em" }}>{todo.content} 
               <div style={{ display: "flex", flexDirection: "row", gap: "1em", justifyContent: "space-between" }}>
                  <Button onClick={() => updateTodo(todo.id)} loadingText='Updating...'  isDisabled={isLoading}>edit task</Button>
                  <Button onClick={() => deleteTodo(todo.id)} loadingText='Deleting... '  isDisabled={isLoading}>delete</Button>
               </div>
              </li> 
             ))}
           </ul>
             </Flex>
         <button onClick={createTodo}>+ new</button>
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
