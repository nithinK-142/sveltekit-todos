<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import Navbar from "./Navbar.svelte";
  import { onSnapshot } from "firebase/firestore";
  import trash from "../assets/trash.svg";
  import Login from "../routes/Login.svelte";
  import { isLoggedIn, user, isLoading } from "../stores";
  import { auth, db } from "./firebaseConfig";
  import { collection, doc, updateDoc, deleteDoc, addDoc, query, orderBy, where } from "firebase/firestore";
  import { flip } from "svelte/animate";

  // Initialize Firebase once
  const userTodosCollection = collection(db, "users", $user.user.uid, "todos");
  const orderDesc = orderBy("createdAt", "desc");

  // State variables
  let task = "";
  let userTodos = [];
  let filter = "";
  let inputElement;

  onMount(() => {
    firestoreInit();
    inputElement.focus();
  });

  const firestoreInit = () => {
    let queryConfig = query(userTodosCollection, orderDesc);
    if (filter === 'active') {
      queryConfig = query(queryConfig, where("isComplete", "==", false));
    } else if (filter === 'completed') {
      queryConfig = query(queryConfig, where("isComplete", "==", true));
    }

    userTodos.length = 0;

    onSnapshot(queryConfig, (querySnapshot) => {
      userTodos = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    },(error) => {
      // console.error("Firestore error:", error);
    });
    $isLoading = false;
  };

  const handleFilterClick = (selectedFilter) => {
    $isLoading = true;
    setTimeout(() => {
      filter = selectedFilter;
      firestoreInit();
    }, 300);
  };

  const addTodo = async () => {
    if (task !== "") {
      const currentDate = new Date();
      const formattedDateAndTime = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()}`;
      await addDoc(userTodosCollection, {
        task: task,
        isComplete: false,
        createdAt: formattedDateAndTime,
      });
      task = "";
    }
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
    // await auth.signOut();
    $isLoggedIn = false;
    // localStorage.setItem("userName", null);
    // localStorage.setItem("userImageURL", null);
  }
</script>

<svelte:window on:keydown={keyPressed} />

{#if $isLoggedIn}
<Navbar />
  <div class="containerr">
    <div class="main-container">

      <div class="flex justify-center mt-14 mb-4 font-['Verdana']">
        <input type="text" placeholder="What needs to be done?"
        class="px-1 py-1 text-xl sm:text-3xl text-white bg-transparent border-0 outline-none caret-inherit focus:placeholder-opacity-50 placeholder-white placeholder-opacity-60  border-white border-b border-opacity-25"
        bind:this={inputElement}
        bind:value={task}
        />
      </div>
      
      <div class="todo-container">

        <div class="w-1/2 sm:w-full text-sm sm:text-xl my-8 text-[#999] border-white border-b border-opacity-25">

          <button on:click={() => handleFilterClick()} class="focus:text-white">All</button>

          <span class="opacity-40">/</span>

          <button on:click={() => handleFilterClick("active")} class="focus:text-white">Active</button>

          <span class="opacity-40">/</span>

          <button on:click={() => handleFilterClick("completed")} class="focus:text-white">Completed</button>
          
        </div>
        
        {#if $isLoading}
          <p>Loading...</p>
        {:else}
          {#each userTodos as item (item.id)}
            <div class="todo-list" animate:flip={{ duration: 300 }}>
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
        {/if}

      </div>

    </div>

    <button class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md" on:click={logout}>Logout</button>
  </div>
{:else}
  <Login />
{/if}

<style>
  .containerr {
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

  .btn {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: none;
    cursor: pointer;
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
    color: white;
    text-align: center;
  }

</style>
