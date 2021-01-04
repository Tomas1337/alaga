import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Landing/Home";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NewProject from "./components/Project/NewProject";
import ProjectProfile from "./components/Project/ProjectProfile";
import DiscoverPage from "./components/Search/DiscoverPage";
import DiscoverMembersPage from "./components/Search/DiscoverMembersPage";
import { authenticate } from "./services/auth";
import UserProfile from "./components/UserProfile/UserProfile";
import ProjectEdit from "./components/Project/ProjectEdit";
import Footer from "./components/Footer/Footer";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await authenticate();
      if (!user.errors) {
        setAuthenticated(true);
        setCurrentUser(user);
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
        setCurrentUser={setCurrentUser}
      />
      <Switch>
        <Route path="/" exact={true} authenticated={authenticated}>
          <Home />
          <Footer />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            setCurrentUser={setCurrentUser}
          />
          <Footer />
        </Route>
        <Route path="/signup" exact={true}>
          <SignUpForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            setCurrentUser={setCurrentUser}
          />
          <Footer />
        </Route>
        <ProtectedRoute
          path="/profile"
          exact={true}
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        >
          <UserProfile user={currentUser} />
          <Footer />
        </ProtectedRoute>
        <ProtectedRoute
          path="/start"
          exact={true}
          authenticated={authenticated}
        >
          <NewProject />
          <Footer />
        </ProtectedRoute>
        <Route path="/project/:id" exact={true} authenticated={authenticated}>
          <ProjectProfile user={currentUser} authenticated={authenticated} />
          <Footer />
        </Route>
        <ProtectedRoute
          path="/project/:id/edit"
          exact={true}
          authenticated={authenticated}
        >
          <ProjectEdit />
          <Footer />
        </ProtectedRoute>
        <Route path="/discover/:query" exact={true}>
          <DiscoverPage />
          <Footer />
        </Route>
        <Route path="/discover/members/:member" exact={true}>
          <DiscoverMembersPage
            user={currentUser}
            authenticated={authenticated}
          />
          <Footer />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
