<script>
  import "../app.css";
  import Navbar from "./Navbar.svelte";
  import { onSnapshot } from "firebase/firestore";
  import trash from "../assets/trash.svg";
  import Login from "../routes/Login.svelte";
  import { isLoggedIn, user, userTodos, isLoading } from "../stores";
  import { auth, db } from "./firebaseConfig";
  import {
    collection,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
  } from "firebase/firestore";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import Input from "./Input.svelte";
  import UserTodo from "./UserTodo.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    $isLoading = true;
    fire.firestoreInit();
    // userTodos1 = [...userTodos1, JSON.stringify($userTodos)];
  });

  // Initialize Firebase once
  let userTodos1 = [];
  // userTodos1 = $userTodos.map((doc) => ({
  //   ...doc.data(),
  //   id: doc.id,
  // }));
  userTodos1 = [...userTodos1, JSON.stringify($userTodos)];
  console.log(userTodos1)
  const userTodosCollection = collection(db, "users", $user.user.uid, "todos");

  // State variables
  console.table(JSON.stringify($userTodos));

  let filter = "";
  let fire;

  const handleFilterClick = (selectedFilter) => {
    $isLoading = true;
    setTimeout(() => {
      filter = selectedFilter;
      firestoreInit();
    }, 300);
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(userTodosCollection, id));
  };

  const markComplete = async (id, completionStatus) => {
    await updateDoc(doc(userTodosCollection, id), {
      isComplete: !completionStatus,
    });
  };

  const logout = async () => {
    $isLoggedIn = false;
    // localStorage.setItem("userName", null);
    // localStorage.setItem("userImageURL", null);
    try {
      await auth.signOut();
    } catch (err) {
      // console.log(err)
    }
  };
</script>

<UserTodo bind:this={fire} />

{#if $isLoggedIn}
  <Navbar />
  <div class="grid gap-10 place-items-center">
    <div class="w-[300px] sm:w-1/2 flex-align flex-col">
      <Input />

      <div class="w-[300px] sm:w-[25rem]">
        <!-- sort -->
        <div class=" text-sm sm:text-xl my-8 ml-4 sm:ml-0 text-[#999]">
          <button on:click={() => fire.firestoreInit()} class="focus:text-white"
            >All</button
          >

          <span class="opacity-40">/</span>

          <button
            on:click={() => fire.firestoreInit("active")}
            class="focus:text-white">Active</button
          >

          <span class="opacity-40">/</span>

          <button
            on:click={() => fire.firestoreInit("completed")}
            class="focus:text-white">Completed</button
          >

          <div
            class="w-[95%] sm:w-[97%] border-white border-b border-opacity-25"
          />
        </div>

        {#if $isLoading}
          <!-- <p>Loading...</p> -->
        {:else}
          <!-- task list -->
          <div class="floating-scrollbar" transition:fade={{ duration: 500 }}>
            {#each userTodos1 as item (item.id)}
              <div
                class="w-full bg-gray-100 flex-align justify-between py-2 px-1 pr-[10px] mb-1"
                animate:flip={{ duration: 300 }}
              >
                <div class="flex w-[95%]">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="cursor-pointer select-none flex-center"
                    on:click={() => markComplete(item.id, item.isComplete)}
                    title={item.isComplete
                      ? "Mark as incomplete"
                      : "Mark as complete"}
                  >
                    <span class="text-xl sm:text-2xl">
                      {item.isComplete ? "🔳" : "✅"}
                    </span>
                  </div>
                  <div
                    class="text-sm sm:text-xl pl-2 pr-1 flex-center font-['Verdana']"
                    class:complete={item.isComplete}
                  >
                    {item.task}
                  </div>
                </div>
                <div class="w-[5%]">
                  <button
                    class="flex-center"
                    on:click={() => deleteTodo(item.id)}
                    title="Delete this task."
                  >
                    <img class="trashIcon" src={trash} alt="trashIcon" />
                  </button>
                </div>
              </div>
            {:else}
              <p class="text-center text-white">Nothing todo</p>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <button
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-600 lg:text-md"
      on:click={logout}
    >
      Logout
    </button>
  </div>
{:else}
  <Login />
{/if}

<style>
  .complete {
    color: rgba(0, 0, 0, 0.424);
    text-decoration: line-through;
    text-decoration-color: rgb(49, 48, 48);
  }
  .trashIcon:hover {
    transition: transform 0.2s linear;
    transform: scale(1.2);
  }
  @media (min-width: 640px) {
    .floating-scrollbar {
      max-height: 50vh;
      padding: 0.4rem;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }

    .floating-scrollbar::-webkit-scrollbar {
      width: 0.5em;
    }
    .floating-scrollbar:hover::-webkit-scrollbar-thumb {
      border-radius: 100vw;
      background: gray;
    }
  }
</style>
