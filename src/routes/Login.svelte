<script>
  import { auth, googleProvider, githubProvider } from "$lib/firebaseConfig";
  import { isLoggedIn, user } from "../stores";
  import { signInWithPopup } from "firebase/auth";
  import Todos from "$lib/Todos.svelte";
  import Google from "../assets/gg.png"
  import GitHub from "../assets/github.svg"

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

    <div class="flex flex-col items-center justify-center gap-4 mt-32 text-center">
      <h1
        class="bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text text-3xl sm:text-4xl font-bold font-mono"
      >
        Sveltkit & Firebase
      </h1>
      <h2
        class="bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text text-2xl sm:text-3xl font-bold font-mono px-3"
      >
        Todo App
      </h2>
    </div>

    <div class="w-full flex justify-center mt-10">

      <div class="flex flex-col bg-[hsla(0,0%,100%,.8)] py-4 px-8 rounded-lg">
        <h3 class="text-black text-center font-bold">Login</h3>
        
        <div class="flex justify-center m-4 space-x-6">
          <span class="w-12 h-12 bg-white hover:bg-teal-100 hover:scale-110 rounded-xl select-none">
            <button
              class="bg-opacity-0 cursor-pointer"
              on:click={() => login("Google")}
            >
              <img src={Google} alt="Google" class="w-12 h-12" />
            </button>
          </span>
    
          <span class="w-12 h-12 bg-white hover:bg-teal-100 hover:scale-110 rounded-xl select-none flex align-center justify-center">
            <button
              class="bg-opacity-0 cursor-pointer"
              on:click={() => login("GitHub")}
            >
              <img
                src={GitHub}
                alt="GitHub"
                class="w-8 h-8"
              />
            </button>
          </span>
      </div>
    </div>

  </section>

{/if}
