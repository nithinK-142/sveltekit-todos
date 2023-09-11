<script>
  import { onMount } from "svelte";
  import { user } from "../stores";
  import { db } from "./firebaseConfig";
  import { collection, addDoc } from "firebase/firestore";
  import { tick } from "svelte";
  
  let task = "";
  let inputElement;

  onMount(() => {
    inputElement.focus();
  });

  const userTodosCollection = collection(db, "users", $user.user.uid, "todos");

  const addTodo = async () => {
    console.log("first")
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

  const keyPressed = (event) => {
    if (event.keyCode === 13) addTodo();
  };
</script>

<svelte:window on:keydown={keyPressed} />

<!-- input -->
<div class="flex-justify mt-14 mb-0 sm:mb-4 font-['Verdana']">
  <input
    type="text"
    placeholder="What needs to be done?"
    class="px-1 py-1 text-xl text-white placeholder-white bg-transparent border-0 border-b border-white border-opacity-25 outline-none sm:text-3xl caret-inherit focus:placeholder-opacity-50 placeholder-opacity-60"
    bind:this={inputElement}
    bind:value={task}
  />
</div>
