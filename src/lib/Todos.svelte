<script>
  import "../app.css";
  import trash from "../assets/trash.svg";
  import Login from "../routes/Login.svelte";
  import { isLoggedIn, user } from "../stores";
  import { flip } from "svelte/animate";
  import { auth, db } from "./firebaseConfig";
  import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    orderBy,
  } from "firebase/firestore";
  import Navbar from "./Navbar.svelte";

  let task = "";
  let userTodos = [];

  const userCollection = collection(db, "users");
  const userTodosCollection = collection(userCollection, $user.user.uid, "todos");

  const getTodos = (querySnapshot) => {
    userTodos.length = 0;
    querySnapshot.forEach((doc) => {
      const todo = {
        ...doc.data(),
        id: doc.id,
      };
      userTodos.push(todo);
    });
  };

  const firestoreInit = () => {
    const todoRef = query(userTodosCollection, orderBy("createdAt", "desc"));

    return onSnapshot(todoRef, getTodos, handleError);
  };

  const handleError = (err) => {
    console.error("Firebase error:", err);
  };

  firestoreInit();

  const addTodo = async () => {
    const currentDate = new Date();
    const formattedDateAndTime = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()}`;

    if (task !== "") {
      const todoRef = await addDoc(userTodosCollection, {
        task: task,
        isComplete: false,
        createdAt: formattedDateAndTime,
      });
    }
    task = "";
  };

  
  const deleteTodo = async (id) => {
    await deleteDoc(doc(userTodosCollection, id));
  };

  const markComplete = async (id, completionStatus) => {
    await updateDoc(doc(userTodosCollection, id), {
      isComplete: !completionStatus,
    });
  };

  const formatAndSliceTask = (task) => {
    const firstSlice = `${task.slice(0, 24)}`;
    let secondSlice = task.slice(24);

    if (secondSlice.length > 24) {
      secondSlice = formatAndSliceTask(secondSlice);
    }

    return `${firstSlice} ${secondSlice}`;
  };

  const keyPressed = (event) => {
    if (event.keyCode === 13) addTodo();
  };

  const logout = async () => {
    await auth.signOut();
    $isLoggedIn = false;
    // localStorage.setItem("userName", null);
    // localStorage.setItem("userImageURL", null);
  }
</script>

<svelte:window on:keydown={keyPressed} />

{#if $isLoggedIn}

  <Navbar />

    <div class="container">
      <div class="main-container">

        <div class="input-container flex">
          <input type="text" placeholder="Add a Task" bind:value={task} />
          <button class="addBtn btn" on:click={addTodo}>+</button>
        </div>

        <div class="todo-container">
          {#each userTodos as item (item.id)}
            <div class="todo-list" animate:flip={{ duration: 200 }}>
              <div class="flex">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="status-container btn"
                  on:click={() => markComplete(item.id, item.isComplete)}
                  title={item.isComplete
                    ? "Mark as incomplete"
                    : "Mark as complete"}
                >
                  {item.isComplete ? "🔳" : "✅"}
                </div>
                <div class="tasks" class:complete={item.isComplete}>
                  {#if item.task.length < 25}
                    {item.task}
                  {:else}
                    {formatAndSliceTask(item.task)}
                  {/if}
                </div>
              </div>
              <div class="delete-container">
                <button
                  class="trashBtn btn"
                  on:click={() => deleteTodo(item.id)}
                  title="Delete this task."
                >
                  <img class="trashIcon" src={trash} alt="trashIcon" />
                </button>
              </div>
            </div>
          {:else}
            <p>No Tasks todo</p>
          {/each}
        </div>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <a
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
      on:click={logout}>
      Logout
      </a>
    </div>
    

{:else}
  <Login />
{/if}

<style>
  .container {
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
    gap: 2.5rem;
  }

  .main-container {
    width: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flex {
    display: flex;
  }

  .input-container {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    height: 3.2rem;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em 1em;
    border-radius: 2px;
    border: 1px solid #ccc;
    box-shadow: 0 0 2px #ddd;
  }

  input:focus {
    outline: 1px solid #444;
  }

  .btn {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: none;
    cursor: pointer;
  }

  .addBtn {
    background: #77b255;
    color: white;
    font-weight: bold;
    padding: 10px 15px;
    font-size: inherit;
  }

  .addBtn:active {
    opacity: 0.7;
  }

  .todo-container {
    width: 25rem;
  }

  .todo-list {
    width: 100%;
    background-color: #f2f0ee;
    display: flex;
    justify-content: space-between;
    padding: 8px 4px;
    padding-right: 10px;
    margin-bottom: 4px;
  }

  .status-container {
    user-select: none;
  }
  .complete {
    color: rgba(0, 0, 0, 0.424);
    text-decoration: line-through;
    text-decoration-color: rgb(49, 48, 48);
  }

  .tasks {
    /* padding-top: 4px; */
    font-size: smaller;
    padding-left: 10px;
  }

  .trashIcon {
    margin-top: 4px;
    height: 26px;
  }

  .trashIcon:hover {
    transition: transform 0.2s linear;
    transform: scale(1.1);
  }

  p {
    text-align: center;
  }

</style>
