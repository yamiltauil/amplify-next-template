import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
   Todo:a.model({
    month:a.string(),
    hourValue:a.integer(),
    workedHours:a.integer(),
    grossSalary:a.integer(),
    freeOfExpensesCash:a.string(),
    inflationRate:a.integer(),
    inflationAdjustment:a.integer(),
    totalExpenses:a.integer(),
    total:a.integer(),
    expenses:a.hasMany(
      'Expenses','todoId'
    ),
    investments:a.hasMany(
      'Investments','todoId'
    )
  }).authorization(allow => [allow.owner()]),
   Expenses:a.model({

     todoId: a.id(),
    todo:a.belongsTo('Todo','todoId'),
    name:a.string(),
    amount:a.integer(),
    type:a.string(),
    date:a.date(),
   }).authorization(allow => [allow.owner()]),
    Investments:a.model({
     todoId: a.id(),
        todo:a.belongsTo('Todo','todoId'),
    initial:a.integer(),
    final:a.integer(),
    registryDate:a.date(),
    paymentDate:a.date(),
  }).authorization(allow => [allow.owner()]),
 });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // apiKeyAuthorizationMode: {
    //   expiresInDays: 30,
    // },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
