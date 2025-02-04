[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/hYl58n6w)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18022760&assignment_repo_type=AssignmentRepo)
# Catstagram

The purpose of this training is to practice The Elm Architecture (TEA) with the React ecosystem.

> 📌 This training is incremental, each exercise is a step to the solution. You only need to push the result of the last exercice (or the latest you succeed to do). It will be part of your evaluation.

For this training we use [Vitejs](https://vitejs.dev/) to bundle our app. It provides a faster and leaner development experience for modern web projects

To run the project:
- `npm install` (or `npm i`)
- `npm run dev` to run project with hot reload, in development mode.


Others npm commands :
- `npm run build` provides a way to build your app on production mode and put the result in the `dist` folder.
- `npm run test` launchs your tests written with [fast-check](https://github.com/dubzzz/fast-check)

This training have two parts:
1. [Meet TEA](./doc/part1.md)
2. [Create your catstagram](./doc/part2.md)

PARTIE 1 : 

# Meet TEA : Everything start with a counter

Our firts task is to create a simple counter using TEA.

## React, Redux & cie

In The Elm Architecture, the data only goes one way. This is called the **one way data flow**.

To experiment TEA and the one way data flow, we will use [**Redux**](https://redux.js.org/).

> Redux is a lightweight state management tool for JavaScript applications, released in 2015 and created by Dan Abramov and Andrew Clark. It's the most popular state management solution and works well with React.

### Testing

To test our app, we will use [`fast-check`](https://github.com/dubzzz/fast-check) that implements Property Based Testing in Javascript. This is the same as [`QuickCheck`](https://hackage.haskell.org/package/QuickCheck-2.14.2/docs/Test-QuickCheck.html) in Haskell or [`Qcheck`](http://c-cube.github.io/qcheck/) in Ocaml.
As a reminder, Property Based Testing is used to test properties of an application. So it generate many inputs for your property and test if it verified. If all is ok, your test pass to green, else your test will be red and fast-check give you a minimal couterexample (it's call shrinking).

The tests are already implemented in `specs` folder. Your mission, if you accept it, is to make sure that all your tests turn green !
### How Redux works ?

On the top-level, we define a state which represents our model in our application.

Then, this state can be updated by function called reducer, which take the current value of the state and an action and return a new state updated with the action intention.

An action is a plain object with a `type` property (mandatory by Redux) which represents what we want to update in our global state.

Once the state is updated by the reducer, views affected by the update can be re-rendered.

An action can be dispatched by an user action or in response of another action.

To get a piece of our state we need to define selectors. Selectors are functions that takes state and return piece of it.


 🧪 Example 🧪 :
```ts
type State = {
  todos: string[]
}

// A selector to get all todos in state
const getAllTodos = (state: State): string[] => state.todos;
```


To sum up :
- *Action* : plain object that represents an intention to change the state. (**Message in TEA**)
- *State* : application data model (**Model** in TEA)
- *Reducer* : pure function used to update the state (**Update in TEA**)
- *View* : user interface (**View in TEA**)
- *Selectors* : pure function to get a piece of state

The Elm Architecture :

![elm-architecture](../elm-archi.jpg)


The Redux "one way dataflow" :
![redux-dataflow](../redux-dataflow.gif)

## Representing our application state

First point is to define the initial state of our application. We store the state in a `State` entity. For a counter its type will be a `number` (in Javascript world) and inital value `0`.


```ts
export type State = {
  counter: number,
}

export const defaultState: State = {
  counter: 0
}
```

🧑‍💻 ➡️ Update `src/reducer.ts` with this piece of code. ⬅️ 🧑‍💻

## Handling events with messages and updates

Now we can represent the counter, we would like to provide buttons `-` and `+` to decrement or increment our state. We need to write an `update` function that translate _messages_ into the desired `state`. The  message  should  describe _what happened_.

> ℹ️ In Redux world, the function `update` is called a `reducer` and the messages that carry our data is called an `action`.

A reducer is simply a function that take the current `state` and an `action` as arguments and return a new `state`. So a reducer type can be sum up by `(state, action) => newState`.
State is updated according to the action in parameter.


Let's go to write our first reducer ! 🙂 💪
First, we define our new types, with the corresponding type constructors called ***action creators*** in Redux world...

```ts
type Increment = { type: 'INCREMENT' };
type Decrement = { type: 'DECREMENT' };

const increment = (): Increment => { type: 'INCREMENT' };
const decrement = (): Decrement => { type: 'DECREMENT' };

type Actions =
  | Increment
  | Decrement

```
... and then, write the reducer

```ts
const reducer = (state: State | undefined, action: Actions) : State => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1};
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1};
  }
}
```

🧑‍💻 ➡️ Update `src/reducer.ts` with this piece of code. [actions type](../src/types/actions.type.ts) and [actions creator](../src/actions.ts) are already written. ⬅️ 🧑‍💻


> ℹ️ A Redux state is undefined when your app is starting. To build your initial state, Redux launch an action to initialize it. That's why in reducer our state is `State | undefined`.

> Another thing, in Typescript there are exhaustive switch statements and to take advantage of it, we need to delete the default case.

## Writing view function

### Expressive UI with functions

Browsers are translating HTML markup into a Document Object Model (a.k.a DOM) that represents the structure of the current page. The DOM consists of DOM nodes, and it’s only by changing these nodes that web applications can modify the current page.

The two most common types of DOM nodes are:
- _Elements_: These have a **tagName** (such as "button" or "div"), and may have child DOM nodes.
- _Text nodes_: These have a **textContent** property instead of a tagName, and are childless.

We want to display 2 buttons and a text:
```html
<div>
    <button> - </button>
    <span> 0 </span>
    <button> + </button>
</div>
```

This HTML produce the relative DOM:

![](../dom-counter.png)

With React, we usually use a syntax called JSX (_Javascript Syntax Expression) which provides syntactic sugar over our component code. This syntax is similar to XML. This syntactic sugar corresponds to functions for creating DOM elements.

🧪 Example 🧪

This expression ...

```ts
<div>Hello {this.props.world}</div>
```

...corresponds to

```ts
React.createElement('div', null, `Hello ${this.props.world}`)
```

⚠️ But it's for your culture, **only use JSX when writing components in React !!**

### The counter view

For this training we will use [styled-components](https://styled-components.com/) to quickly add theming. It provides a way to define components styled with CSS.
Let's go to define our style ! 🚀


```ts
const Container = styled.div`
  padding: 16px;
  justify-content: center;
  display: flex;
`;

const Button = styled.button`
  padding: 16px 32px;
  background-color: indigo;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  &:hover {
    background-color: #3c0068;
  }
  &:focus {
    background-color: #5e00a3;
  }
  &:disabled {
    background-color: #808080;
  }
`;

const DisplayCounter = styled.span`
  padding: 16px 32px;
  margin-top: 8px;
  color: darkgrey;
`;
```


Then we can write our first component ! 🚀
```ts
const Counter = () => {
  const counter = useSelector(counterSelector);
  const dispatch = useDispatch();
  return (
    <Container>
      <Button onClick={() => dispatch(decrement())}> - </Button>
      <DisplayCounter>{counter}</DisplayCounter>
      <Button onClick={() => dispatch(increment())}> + </Button>
    </Container>
  );
};
```

🧑‍💻 ➡️ Update [counter component](../src/components/counter.tsx) with this piece of code. Styles are already provided ⬅️ 🧑‍💻

To keep the app simple, we use Redux hooks `useSelector` and `useDispatch` :
- [`useSelector`](https://react-redux.js.org/api/hooks#useselector) is used to get a value from Redux state
- [`useDispatch`](https://react-redux.js.org/api/hooks#usedispatch) provides a way to dispatch an action



> ℹ️ Notice that `view` builds fresh HTML values after every update. That might sound like a lot of performance overhead, but in practice, it’s almost always a performance benefit!
This  is  because  React  doesn’t  actually  re-create  the  entire  DOM  structure  of  the page every time. Instead, it compares the HTML it got this time to the HTML it got last time and updates only the parts of the page that are different between the two requested representations.

> This approach to virtual  DOM  rendering was popularized by React and it has several benefits over manually altering individual parts of the DOM:
> - Updates are batched to avoid expensive repaints and layout reflows
> - Application state is far less likely to get out of sync with the page
> - Replaying application state changes effectively replays user interface changes


## 🧑‍💻 Exercice 1 🧑‍💻

We only want the implement the rule: **Counter value must be greater than or equal to 3**.
- update `counterSelector` to get counter value from state
- modify `reducer` to avoid counter below 3
- modify `counter component` to disable the button `-` when counter value is 3

> ℹ️ [disabled](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-disabled) attribute on button can help you ...

Now you are ready to [create your catstagram](./part2.md)



# Catstagram

We will build a thumnbail of cats pictures.

## 🔁 Iteration 1 : Fake data 🔁

We would like to display a thumbnail of pictures.

### US1 : Display the thumbnail

> AS a user
>
> I WANT to display a thumbnail of X pictures

> BUSINESS RULE: X = min(value of the counter, number of avalaible pictures)

## 🧑‍💻 Exercice 2: Implement US1 with fake datas 🧑‍💻

You can use this type with some fake datas :

```ts
export type Picture = {
  previewFormat: string;
  webformatFormat: string;
  author: string;
  largeFormat: string;
};
```
Type `Picture` is in this [file](../src/types/picture.type.ts)

Fake data are in [fake-datas.json](../src/fake-datas.json) file.

Your tasks:
- Update the **state type** and initial value to store an array of pictures (💡 Tip : [slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice))
- Update the **reducer** to update the array of pictures while updating the counter value (ex: if counter's value is 5 you must have 5 pictures)
- Update **pictures selector** to get pictures from state
- Update [pictures component](../src/components/pictures.tsx) to display the pictures in `previewFormat`.
### US2 : Manage the popover

> AS a user
>
> WHEN I click on a picture
>
> I WANT to display a modal with large picture, info about author and a close button

> BUSINESS RULE: Click on close button must close the modal

>  [Modal component](../src/components/modal.tsx) is already written. It use [React Portal](https://beta.reactjs.org/reference/react-dom/createPortal). A portal is used to render some React components in different part of the DOM.
> In [index.html](../index.html), you can see :
```html
    <div id="root"></div>
    <div id="modal"></div>
```
Our application is render on `"root div"` and our modal on `"modal div"`. Portals are very interesting to build modal or tooltip components.



## 🧑‍💻 Exercice 3: Implement US2 with fake datas 🧑‍💻

Your tasks:
- Update the **state** to store the picture selected
- Create a new **action** that represent the fact you selected a picture
- Create a new **action** that represent the fact you closed the modal
- Update **selector** to get pictureSelected from the state
- Update the **reducer** to manage picture's selection
- Update [pictures component](../src/components/pictures.tsx)  to display (or not) the picture in largeFormat when you click on small picture.

> ℹ️ For actions, you can check types in [actions.type.ts](../src/types/actions.type.ts)

> 🆘 To represent the presence or lack of our selected picture, we can use `Option` type from [fs-ts Option module](https://gcanti.github.io/fp-ts/modules/Option.ts.html). To access to the value when your option is `some`, you can do this : `mySomeOption.value`.


## 🔁 Iteration 2 :  Our application is no more a simple app 🔁

### Cats API


Start by creating an account on pixabay.com to get an API key https://pixabay.com/api/docs/

![](../pixabay-register.png)

Then you can get your pictures from the API :
`https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat`

> ℹ️  To try API, you can paste this url in your browser (think to replace with your api key and a value for the counter):
>
>`https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat`


### Manage effects

#### **Redux middlewares**

Since we will manage asynchronous effects (API call, random number, ...), our application must be modify.

Previously we only handled mouse interactions but what about talking to a server ?

Within TEA effects are managed by **commands** represented by an action and triggered by a reducer, simple app was an app that doesn't trigger commands.

In React/Redux ecosystem, there are several ways to manage the effects and many libraries implements them such as [redux-thunk](https://github.com/reduxjs/redux-thunk) to manage asynchronous actions (like server calls) or [redux-saga](https://redux-saga.js.org/) which implements the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern).
In our case, [redux-loop](https://redux-loop.js.org/) is a library that implements TEA for Redux, so we will use it for our application to manage the effects.

#### **Installation of our middlewares**

Installing Redux-loop is pretty simple in our app : you must simply import the `install` function and provide it to the `createStore` function.

In order to be compliant with Typescript compiler, you must cast `createStore` and `reducer` functions :
- `createStore` function as `StoreCreator` type
- `reducer` function as `LoopReducer<State, Actions>` type. `< >` means it's a generic type.

> ℹ️ Another usefull Redux middleware is [`redux-logger`](https://github.com/LogRocket/redux-logger). It logs your actions dispatched in web console.

> ℹ️ You can check [store.ts file](../src/store.ts) to understand how installation of Redux middleware works.

#### **Redux Loop**

Redux-loop provide a way to manage our effects in reducers. It implies that our reducer function has not the same type as before. It can return either a state or a loop.

> ℹ️ Redux-loop provide a `Loop` type.

In a loop, you can dispatch another action with `Cmd.action`. In this way we can chain actions. If you need to run a function after an action, you can use `Cmd.run`. You can find more informations about `Cmd` [here](https://redux-loop.js.org/docs/api-docs/cmds.html).

🧪 An example with a loop and a store's update 🧪

```ts
const reducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_ERROR':
      return loop(state, Cmd.run(() => console.log(state.error)));
    case 'SET_ERROR':
      return {...state, message: action.error }
  }
}
```
(This is an example, not a part of our application 😉)


## 🔁 Iteration 3 :  Make a service call 🔁


I provide you a redux-loop command to manage API calls. You can find it in [commands.ts](../src/commands.ts) :

```ts
import { Cmd } from 'redux-loop';

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, {
        method: action.method,
      })
        .then(checkStatus)
    },
    {
      successActionCreator: fetchCatsCommit, // (equals to (payload) => fetchCatsCommit(payload))
      failActionCreator: fetchCatsRollback, // (equals to (error) => fetchCatsCommit(error))
    },
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};
```

where :
- `action.path` is the uri of the api (in our case: `https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat`)
- `action.method` is the HTTP verb use for the request
- `successActionCreator` is the callback when the api responded with a success code. **It must return an action.**
- `failActionCreator` is the callback when the api responded with an error code. **It must return an action.**

🧪 For example, you can use it in reducer like 🧪
```ts
...
case 'SOME_FETCHING_ACTION':
  return loop(state, cmdFetch(action))
...
```
`cmdFetch` and `fetch` functions gives us clues about the complexity of effects like calling an api:
- *Asynchrounous*: meaning we want to **wait** for a result, **without blocking** the whole application
- *Success*: the effect may or may not be successful and we have to manage both cases

We will need to represent this in our state and in our actions.
## 🧑‍💻 Exercice 5: Send command to call API  🧑‍💻

Your tasks:
- Update **action** `fetchCatsRequest` with your path to pixabay API
- Update **reducer** to dispatch an action to fetch datas when we increment or decrement counter.

## 🧑‍💻 Exercice 6: Process the result of API call 🧑‍💻

_At this step we will put all the plumbing but not yet parse the response_

Your tasks:

- Update types in [api.type.ts](../src/types/api.type.ts) and their type constructors in [api.ts](../src/api.ts) to represent the status of our API call
>💡 Tip: At the previous step the state would have been *an int counter AND a picture array* ; at this step the *picture array* should be modify for a type that defines something like a *loading OR success of a picture array OR failure of a string* (the message error seems to be a perfect string)

- Update the **state** type to manage the result of an API call

- Update the **initial value** to fit with our new state type
>💡 Tip: a success of an empty array seems a good idea

- Update **action** `fetchCatsCommit` his type to fit with our new type of pictures.

- Update the **reducer** to update state with correct status of API call and send a command to log error when the request rollback.

> 🆘 At this step, your tests may be crashed because we need the last part of our application. So, let's go 🚀 💪

## 🔁 Iteration 4 : Parse response to data 🔁

One of the hardest part when you start using statically typed langage for web programming is about parsing data. Good to us, Typescript is javascript and JSON object is like a javascript object, so it will be simple.

We will use the [json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json) method from the `Response` type, returned by the `fetch` function. It provide an easy way to parse our data. This method return a Promise with data as value.


First we should take a look at a [sample of the body response from pixabay](../sample-api-response.json).

Our objective is to gets a pictures array from the `hits`.

## 🧑‍💻 Exercice 7 : Parse datas 🧑‍💻

Your tasks :
- Parse the string to a JSON with `json` method
- Extract the `hits` array and create an array of Picture.

> 💡 Tip: your parsing function must return a `Promise` to chain it with `fetch` in [cmdFetch](../src/commands.ts).

## 🧑‍💻 Exercice 8 : Finalize the app 🧑‍💻

At this step you should be able to plug all parts together to parse the response and make your app works with real datas.

Your tasks:
- Update [picture component](../src/components/pictures.tsx) to display your Castagram 🎉