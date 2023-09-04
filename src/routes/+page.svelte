<script>
  import "../app.css";
  import { auth, googleProvider, githubProvider } from "$lib/firebaseConfig";
  import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
  import { goto } from "$app/navigation";

  const login = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);

      const userName = data.user.displayName;
      const userImageURL = getAdditionalUserInfo(data).profile.picture || null;

      console.log(userName, userImageURL);

      // $user = res.user;
      // $isLoggedIn = true;
      goto("/login");
    } catch (error) {
      console.error(error);
    }
  };
</script>

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
    <!-- <img src="/sveltekit.webp" alt="sveltekit"> -->
  </div>

  <div class="sm:flex sm:justify-center m-10 gap-5">
    <a
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
      on:click={login}
    >
      Google
    </a>

    <a
      class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
      href="/login"
    >
      Github
    </a>
  </div>
</section>
