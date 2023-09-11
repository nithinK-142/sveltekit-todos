<script>
  import { user, isLoading } from "../stores";
  import { db } from "./firebaseConfig";
  import { onSnapshot } from "firebase/firestore";
  import { collection, query, where, orderBy } from "firebase/firestore";

  // let filter = "active";
  let userTodos = [];
  const userTodosCollection = collection(db, "users", $user.user.uid, "todos");
  const orderDesc = orderBy("createdAt", "desc");

  export const firestoreInit = (filter) => {
    let queryConfig = query(userTodosCollection, orderDesc);
    if (filter === "active") {
      queryConfig = query(queryConfig, where("isComplete", "==", false));
    } else if (filter === "completed") {
      queryConfig = query(queryConfig, where("isComplete", "==", true));
    }

    userTodos.length = 0;

    onSnapshot(
      queryConfig,
      (querySnapshot) => {
        userTodos = querySnapshot.docs.map((doc) => ({
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
