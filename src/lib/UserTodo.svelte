<script>
  import { user, userTodos, isLoading } from "../stores";
  import { db } from "./firebaseConfig";
  import { onSnapshot } from "firebase/firestore";
  import { collection, query, where, orderBy } from "firebase/firestore";

  // let filter = "active";
  const userTodosCollection = collection(db, "users", $user.user.uid, "todos");
  const orderDesc = orderBy("createdAt", "desc");
  // console.log(JSON.stringify($userTodos))

  export const firestoreInit = (filter) => {
    console.log("first")
    let queryConfig = query(userTodosCollection, orderDesc);
    if (filter === "active") {
      queryConfig = query(queryConfig, where("isComplete", "==", false));
    } else if (filter === "completed") {
      queryConfig = query(queryConfig, where("isComplete", "==", true));
    }

    $userTodos.length = 0;

    onSnapshot(
      queryConfig,
      (querySnapshot) => {
        $userTodos = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      },
      (error) => {
        // console.error("Firestore error:", error);
      }
    );
    $isLoading = false;
  };
</script>
