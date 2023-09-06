<script>
    import { user } from "../stores";
    import logo from "../assets/todo32.png";
</script>

<nav>
    <div class="w-full bg-slate-500 flex justify-between px-4 py-2 select-none">

        <div class="flex items-center space-x-2">
            <span class="object-cover h-6">
                <img src={logo} alt="logo" class="h-6 object-cover" id="user-image" />
            </span>
            <h1>
                <strong>Svelte Todos</strong>
            </h1>
        </div>

        <div class="flex items-center group space-x-2">
            <span class="h-10 w-10 rounded-full object-cover">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={$user.photoURL} alt="UserImage" class="rounded-full w-10 h-10 cursor-pointer userimg"  
                />
            </span>
            
            <div class="hidden group-hover:block z-50 absolute my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 top-[4%] right-[1%] w-52 border border-gray-300">
                <div class="px-4 py-3">
                  <span class="block text-sm text-gray-900 dark:text-white">{$user.displayName || "username not found!"}</span>
                  <span class="block text-sm  text-gray-500 truncate dark:text-gray-400" title={$user.email || "email not found!!"}>{$user.email || "email not found!!"}</span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a href={"#"} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</a>
                  </li>
                  <li>
                    <a href={"#"} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                  </li>
                  <li>
                    <a href={"#"} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
                  </li>
                  <li>
                    <a href={"#"} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                  </li>
                </ul>
            </div>

        </div>
    </div>
</nav>