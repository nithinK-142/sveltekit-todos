<script>
  import { auth, googleProvider, githubProvider } from "$lib/firebaseConfig";
  import { isLoggedIn } from "../stores";
  import { signInWithPopup } from "firebase/auth";
  import Todos from "$lib/Todos.svelte";

    let localUserName = "";
    let localUserImageURL = "";


  const login = async (provider) => {
    try {
      const providerMap = {
        Google: {
          provider: googleProvider,
          userNameProp: "user.displayName",
          imageURLProp: "user.photoURL",
        },
        GitHub: {
          provider: githubProvider,
          userNameProp: "_tokenResponse.screenName",
          imageURLProp: "_tokenResponse.photoUrl",
        },
      };

      const selectedProvider = providerMap[provider];

      const signInResponse = await signInWithPopup(auth, selectedProvider.provider);

      const userName = eval(`signInResponse.${selectedProvider.userNameProp}`);
      const userImageURL = eval(`signInResponse.${selectedProvider.imageURLProp}`) || null;

      // $user = signInResponse.user;
      $isLoggedIn = true;
      
      localStorage.setItem("userName", userName);
      localStorage.setItem("userImageURL", userImageURL);

      localUserName = userName;
      localUserImageURL = userImageURL;

    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    // await auth.signOut();
    $isLoggedIn = false;
    localStorage.setItem("userName", null);
    localStorage.setItem("userImageURL", null);
  }

</script>

{#if $isLoggedIn}

  <div class="sm:flex sm:flex-col sm:justify-center sm:items-center m-10 gap-6">
    <h1 class="text-black text-2xl font-semibold">Welcome, {localUserName}!</h1>
    <span class="h-20 w-20 rounded-full">
      <img src={localUserImageURL} alt="UserImage" class=" rounded-full" />
    </span>

    <Todos />

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
      on:click={logout}
    >
      Logout
    </a>
  </div>

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
        Google Login Authentication
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
