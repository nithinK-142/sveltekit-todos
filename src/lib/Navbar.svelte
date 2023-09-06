<script>
    import { user } from "../stores";
    import logo from "../assets/todo32.png";

    let isDropdownVisible = false;

    const toggleDropdown = () => {
        isDropdownVisible = !isDropdownVisible;
    }
</script>

<nav>
    <div class="w-full bg-slate-500 flex justify-between px-4 py-2">

        <div class="flex items-center space-x-2">
            <span class="bg-slate-900 object-cover h-6">
                <img src={logo} alt="logo" class="h-6 object-cover" id="user-image" />
            </span>
            <h1>
                <strong>Svelte Todos</strong>
            </h1>
        </div>

        <div class="flex items-center space-x-2">
            <span class="h-10 w-10 rounded-full object-cover">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={$user.photoURL} alt="UserImage" class="rounded-full w-10 h-10 cursor-pointer" on:click={toggleDropdown} />
            </span>
            
{#if isDropdownVisible}
            <div class="z-50 absolute  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 " id="user-dropdown">
                <div class="px-4 py-3">
                  <span class="block text-sm text-gray-900 dark:text-white">{$user.displayName}</span>
                  <span class="block text-sm  text-gray-500 truncate dark:text-gray-400" title={$user.email}>{$user.email}</span>
                </div>
                <!-- <ul class="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                  </li>
                </ul> -->
              </div>
        
{/if}
        </div>
    </div>
</nav>

<style>
    /* Add this CSS for user-dropdown */
    #user-dropdown {
        position: absolute;
        top: 5%;
        right: 0.5%;
        width: 200px; /* Adjust the width as needed */
        border: 1px solid #ccc;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 50;
    }

</style>