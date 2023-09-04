<script>
  import { auth, googleProvider, githubProvider } from "$lib/firebaseConfig";
  import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";

  console.log(auth);

  const login = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);

      const userName = data.user.displayName;
      const userImageURL = getAdditionalUserInfo(data).profile.picture || null;

      console.log(userName, userImageURL)

      // $user = res.user;
      // $isLoggedIn = true;
      // goto('/profile');
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="sm:flex sm:flex-col sm:justify-center sm:items-center m-10 gap-6">
  <h1 class="text-black text-2xl font-semibold">Login</h1>
  <a
    class="block rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-700 lg:text-md"
    href="/"
  >
    Logout
  </a>
</div>
