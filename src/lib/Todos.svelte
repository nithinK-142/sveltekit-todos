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
  import { fade } from "svelte/transition";
  import { tick } from 'svelte';

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
      const todoRef = await addDoc(userTodosCollection, {
        task: task,
        isComplete: false,
        createdAt: formattedDateAndTime,
      });
      task = "";
      await tick();
      inputElement.focus();
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

  const keyPressed = (event) => {
    if (event.keyCode === 13) addTodo();
  };

  const logout = async () => {
    $isLoggedIn = false;
    // localStorage.setItem("userName", null);
    // localStorage.setItem("userImageURL", null);
    try {
      await auth.signOut();
    }catch(err){
      // console.log(err)
    }
  }
</script>

<svelte:window on:keydown={keyPressed} />

{#if $isLoggedIn}
<Navbar />
  <div class="grid place-items-center gap-10">
    <div class="w-[300px] sm:w-1/2 flex-align flex-col">

      <!-- input -->
      <div class="flex-justify mt-14 mb-0 sm:mb-4 font-['Verdana']">
        <input type="text" placeholder="What needs to be done?"
        class="px-1 py-1 text-xl sm:text-3xl text-white bg-transparent border-0 outline-none caret-inherit focus:placeholder-opacity-50 placeholder-white placeholder-opacity-60  border-white border-b border-opacity-25"
        bind:this={inputElement}
        bind:value={task}
        />
      </div>
      
      <div class="w-[300px] sm:w-[25rem]">

      <!-- sort -->
        <div class="w-full text-sm sm:text-xl my-8 ml-4 sm:ml-0 text-[#999] ">

          <button on:click={() => handleFilterClick()} class="focus:text-white">All</button>

          <span class="opacity-40">/</span>

          <button on:click={() => handleFilterClick("active")} class="focus:text-white">Active</button>

          <span class="opacity-40">/</span>

          <button on:click={() => handleFilterClick("completed")} class="focus:text-white">Completed</button>

          <div class="w-[90%] sm:w-full border-white border-b border-opacity-25 "></div>      
        </div>
        
        {#if $isLoading}
          <!-- <p>Loading...</p> -->
        {:else}
          <!-- task list -->
          <div class="floating-scrollbar" transition:fade={{ duration: 500 }}>
            {#each userTodos as item (item.id)}
              <div class="w-full bg-gray-100 flex-align justify-between py-2 px-1 pr-[10px] mb-1" animate:flip={{ duration: 300 }}>
                <div class="flex w-[95%]">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div 
                    class="select-none cursor-pointer flex-center "
                    on:click={() => markComplete(item.id, item.isComplete)}
                    title={item.isComplete ? "Mark as incomplete" : "Mark as complete"}>
                    <span class="text-xl sm:text-2xl">
                      {item.isComplete ? "🔳" : "✅"}
                    </span>
                  </div>
                  <div class="text-sm sm:text-xl pl-2 pr-1 flex-center font-['Verdana']" class:complete={item.isComplete}>
                      {item.task}
                  </div>
                </div>
                <div class="w-[5%]">
                  <button
                  class="flex-center"
                    on:click={() => deleteTodo(item.id)}
                    title="Delete this task."
                  >
                    <img class="trashIcon" src={trash} alt="trashIcon"/>
                  </button>
                </div>
              </div>
            {:else}
              <p class="text-white text-center">Nothing todo</p>
            {/each}
          </div>
        {/if}

      </div>

    </div>

    <button 
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-600 lg:text-md" on:click={logout}>
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