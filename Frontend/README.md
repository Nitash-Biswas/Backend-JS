# Understanding Frontend

## Data Model Diagram

- https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj

## Steps for Setting Up and Developing the Frontend

### 1. Setup Project

- Initialize a new Vite project in the frontend folder:
  ```bash
  npm create vite@latest frontend
  ```
- Install necessary dependencies:
  ```bash
  npm install
  ```
  - `axios` : Promise based HTTP Client ( for making HTTP requests )
  - `tailwindcss @tailwindcss/vite` : Tailwind CSS for styling
  - `react-router-dom` : For routing across different pages in the React App.
  - `react-icons` : For cute icons !!
  - `js-cookie` : JS API for handling cookies (set,get, remove cookies, containing tokens)
  - `@cloudinary/url-gen @cloudinary/react` : Provides Cloud Storage for Media.

### 2. `index.html` : The entry point of the application

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Watchly</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- main.jsx is the actual source code -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 3. Setup `src/main.jsx`

- `src/main.jsx` mounts the app to #root in index.html.

  ```jsx
  import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
  } from "react-router-dom";
  //Routes could be self closing or nested:
  /*

  1. localhost:5173 / renders the home page component.
  2. localhost:5173 /user/:username renders the dashboard component.
  3. localhost:5173 /user/:username/videos renders the dashboard component with user videos.

  */
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />

        <Route path="/user/:username" element={<ChannelDashboard />}>
          <Route path="videos" element={<UserVideos />} />
          <Route path="playlists" element={<UserPlaylists />} />
          <Route path="tweets" element={<UserTweets />} />
        </Route>
      </Route>
    )
  );

  //Mounts routed app to root
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </StrictMode>
  );
  ```

### 4. `src/assets`

- Folder containing static assets like logos.
- `public` folder could also be used for that.

### 5. Components in `src/components`

- Components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.

- List of Components used in the App

  - Layout (always keeps Header and Sidebar in the app)
  - Header
  - Sidebar

  ***

  - Add To Playlist
  - Card
    - Card
    - Channel Card
    - Comment Card
    - Long Card
    - Playlist Card
    - Tweet Card

  ***

  - Comments
    - Add Comment
    - All Comments
  - Tweets
    - Add Tweet
    - All Tweets
  - Playlist

  ***

  - Edit Image (edits avatar and cover Image in profile)
  - Edit Password
  - Edit Video (edits Title and Description)

  ***

  - User Playlists
  - User Subscribers
    - Subscribed To (channels)
    - Subscribers
  - User Tweets
  - User Videos
  - Video Player

- Example: `PlaylistCard.jsx`

  - 2 ways of passing props

    ```jsx
    function PlaylistCard(props) {
      return <h1>Title is {props.title}</h1>;
    }

    function Playlist() {
      return <PlaylistCard title="First Playlist" />;
    }
    ```

  ```jsx
  import React from "react";
  import { NavLink } from "react-router-dom";

  //this
  export default function PlaylistCard({
    title = "No title",
    thumbnail = "No thumbnail",
    uploader = "Someone",
    playlistId = "No videoId",
    description = "No description yet",
    username = "N/A",
  }) {
    return (
      <div>
        <NavLink to={`/playlist/${playlistId}`}>
          <img src={thumbnail} alt={title} />
        </NavLink>
        <div>
          <NavLink to={`/playlist/${playlistId}`}>
            <h2>{title}</h2>
          </NavLink>
          <NavLink to={`/user/${username}`}>
            <p> {uploader}</p>
          </NavLink>
          <p> {description}</p>
        </div>
      </div>
    );
  }
  ```

### 6. Contexts in `src/contexts`

- The need?

  - `Prop Drilling`
  - happens when you pass data (props) from a parent component down through multiple layers of child components, even if some of those intermediate components don’t need the data themselves. It’s a straightforward way to share data in `React’s unidirectional data flow`, but it can get messy in deeply nested component trees.

    ```jsx
    function App() {
      const user = "Alice";

      return <Parent user={user} />;
    }

    function Parent({ user }) {
      return <Child user={user} />;
    }

    function Child({ user }) {
      return <Grandchild user={user} />;
    }

    function Grandchild({ user }) {
      return <p>Hello, {user}!</p>;
    }
    ```

  - Here, `Parent` and `Child` don’t use user themselves—they just pass it down. If the tree gets deeper or you’re passing multiple props, this can become cumbersome and harder to maintain.

- `React Context` is a built-in solution to avoid prop drilling by providing a way to share data globally (or across a specific subtree) without explicitly passing props through every level. It’s especially useful for data that many components need access to, like themes, user authentication, or app-wide settings.

- Context used in the App

  - User Context (provides the details of the logged user across the app)

    ```jsx
    import React, { useEffect, useState } from "react";
    import UserContext from "./userContext.js";
    import { useCheckAuth } from "../hooks/useCheckAuth.js";

    const UserContextProvider = ({ children }) => {
      const { isAuthenticated, user, loading } = useCheckAuth();
      const [loggedUser, setLoggedUser] = useState(null);

      useEffect(() => {
        if (isAuthenticated && user && !loading) {
          setLoggedUser(user);
        } else {
          setLoggedUser(null);
        }
      }, [isAuthenticated, user, loading]);

      return (
        <UserContext.Provider
          value={{ loggedUser, setLoggedUser, loading, isAuthenticated, user }}
        >
          {children}
        </UserContext.Provider>
      );
    };

    export default UserContextProvider;
    ```

### 7. Custom Hooks

- Custom hooks in React are reusable functions that let you encapsulate and share logic between components. They’re a way to extract stateful logic (or any reusable behavior) from a component into a standalone function, leveraging React’s built-in hooks like `useState`, `useEffect`, or others. Since they’re just JavaScript functions, you can define them yourself and name them with the `use` prefix (a convention that tells React they’re hooks).

- Why Use Custom Hooks?

  - `Reusability`: Avoid duplicating logic across components.
  - `Clarity`: Keep components focused on rendering rather than complex logic ( like fetching )

- How they work?

  - You make a function:\
    Write a function that starts with `use` (like `useSomething`) and put some React hook stuff inside it—like tracking state or running side effects.

  - It uses React hooks:\
    Inside, you can call hooks like `useState` to hold data or `useEffect` to do something when things change.

  - It gives back what you need:\
    The function returns whatever you want—like some data, a function, or both—for your component to use.

  - You use it anywhere:\
    Call your custom hook in any component, and it runs its logic right there, keeping things neat.

  - Example:\
    Creating a custom hook `useFetchPlaylist()` in `src/hooks/usePlaylistHooks.js`

    ```js
    export const useFetchPlaylist = (playlistId) => {
      //useState to hold data
      const [playlistData, setPlaylistData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchPlaylist = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}${PLAYLISTS_URL}/${playlistId}`
          );
          setPlaylistData(response.data?.data.finalPlaylist);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      //useEffect to fetch the playlist on mount
      useEffect(() => {
        fetchPlaylist();
      }, []);

      // console.log(playlistData);
      return { playlistData, error, loading, refresh: fetchPlaylist };
    };
    ```

    Using this hook

    ```jsx
    function Playlist() {
      const { playlistData, error, loading, refresh } =
        useFetchPlaylist(playlistId);

      const handleRefresh = () => {
        refresh();
      };

      if (loading) {
        return <div>Loading...</div>;
      }

      if (error) {
        return <div>{error}</div>;
      }

      return (
        <>
          <p>{playlistData.name}</p>
          <button
            onClick={() => {
              handleRefresh();
            }}
          >
            X
          </button>
        </>
      );
    }
    ```
- `In this App, they are used for fetching data and API calls.`

- Hooks used in the App:
  - useCheckAuth.js

  - useCommentHooks.js
    - useFetchComments
    - useAddComment
    - useUpdateAndDeleteComment

  - useLikeHooks.js
    - useFetchLikedVideos
    - useToggleLike (Video, Comment, Tweet)
    - useGetTotalLikes (Video, Comment, Tweet)
    - useCheckLike (Video, Comment, Tweet)

  - usePlaylistHooks.js
    - useFetchPlaylist( playlistId )
    - useFetchUserPlaylists( username )
    - useManageVideosInPlaylist ( addVideo, removeVideo )
    - useManagePlaylist ( createPlaylist, deletePlaylist )

  - useSubscriptionHooks.js
    - useFetchSubscribers
    - useFetchSubscribed
    - useToggleSubscription
    - useCheckSubscriptionStatus
    - useFetchSubscriberCount

  - useTweetHooks.js
    - useFetchAllTweets
    - useFetchUserTweets
    - useAddTweet
    - useUpdateAndDeleteTweet

  - useUserHooks.js
    - useRegisterUser
    - useLoginUser
    - useFetchUserDetails
    - useUpdatePassword
    - useUpdateImages (update cover Image and avatar)
    - useGetWatchHistory
    - useEditWatchHistory (AddTo, RemoveFrom, Clear)
    - useLogoutUser
    - useDeleteUser

  - useVideoHooks.js
    - useFetchVideo
    - useFetchAllVideos
    - useFetchUserVideos
    - useUpdateAndDeleteVideo
    - usePublishVideo

### 8. Pages

- React doesn’t have a native concept of pages like traditional multi-page websites (e.g., separate HTML files)
- React `builds single-page applications` (SPAs) where the UI updates dynamically without full page reloads.
- So essentially, React just renders different components on the same page depending on which route you're at.

- Pages in the App
  - Create Video
  - Channel Dashboard
    - User Videos
    - User Tweets
    - User Playlists
  - History
  - Home
  - Liked Videos
  - Login
  - Not Found
  - Not Logged In
  - Profile
  - Register
  - Stats
  - Tweets


### 9. Utilities

- Create Small Utility Functions that could be reused anywhere in the app.

- Utility Functions in the App
  - cardDummyDataGen.js
  - extractDate.js
  - formatDuration.js
  - formatTimeAgo.js
  - getPublicId.js

