import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCVvWZsJqSvJDRmroz3PwoP1bYqM7tIiM",
  authDomain: "sveltekit-fire-364d2.firebaseapp.com",
  projectId: "sveltekit-fire-364d2",
  storageBucket: "sveltekit-fire-364d2.appspot.com",
  messagingSenderId: "931308343500",
  appId: "1:931308343500:web:72f49480db498d3c96b269"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };