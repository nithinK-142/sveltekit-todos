<script>
  import { auth, googleProvider, githubProvider } from "$lib/firebaseConfig";
  import { isLoggedIn, user } from "../stores";
  import { signInWithPopup } from "firebase/auth";
  import Todos from "$lib/Todos.svelte";

    // let localUID = "";
    // let localUserName = "";
    // let localUserImageURL = "";


  const login = async (provider) => {
    try {
      const providerMap = {
        Google: {
          provider: googleProvider,
          // userNameProp: "user.displayName",
          // imageURLProp: "user.photoURL",
        },
        GitHub: {
          provider: githubProvider,
          // userNameProp: "user.displayName",
          // imageURLProp: "user.photoURL",
          // userNameHandle: "_tokenResponse.screenName"
        },
      };

      const selectedProvider = providerMap[provider];

      const signInResponse = await signInWithPopup(auth, selectedProvider.provider);

      // const userName = eval(`signInResponse.${selectedProvider.userNameProp}`) || eval(`signInResponse.${selectedProvider.userNameHandle}`);
      // const userImageURL = eval(`signInResponse.${selectedProvider.imageURLProp}`) || null;
      // $user = eval(`signInResponse.${selectedProvider.details}`);

      // console.log(signInResponse._tokenResponse)
      // console.log(signInResponse.user)

      // const uid = signInResponse.user.uid;
      // const userName = signInResponse.user.displayName || "user23";
      // const userImageURL = signInResponse.user.photoURL || null;

      $user = signInResponse;

      // const objectSize = Object.keys($user).length;
      // console.log(`Size of $user object: ${objectSize}`);

      $isLoggedIn = true;
      
      // localStorage.setItem("userName", userName);
      // localStorage.setItem("userImageURL", userImageURL);

      // localUserName = userName;
      // localUserImageURL = userImageURL;

    } catch (error) {
      console.error(error);
    }
  };


</script>

{#if $isLoggedIn}
    <Todos />
{:else}

  <section>
    <div
      class="flex flex-col items-center justify-center gap-4 mt-20 text-center"
    >
      <h1
        class="bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text text-4xl font-bold font-mono"
      >
        Sveltkit & Firebase
      </h1>
      <h2
        class="bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text text-2xl font-bold font-mono px-3"
      >
        Todo App
      </h2>
    </div>

    <div class="sm:flex sm:justify-center m-10 gap-5">
      <button
        class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
        on:click={() => login("Google")}
      >
        Google
      </button>
    
      <button
        class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
        on:click={() => login("GitHub")}
      >
        Github
      </button>
    </div>
  </section>

{/if}
