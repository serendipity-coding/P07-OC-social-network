import Vue from "vue";
import Router from "vue-router";
import Login from "../components/auth/Login.vue";
import Home from "../components/home/Home.vue";
import Signup from "../components/auth/Signup.vue";
import Profile from "../components/home/Profile.vue";
import NewPost from "../components/home/NewPost.vue";
import AdminDashboard from "../components/home/AdminDashboard.vue";
import ViewPost from "../components/home/ViewPost.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },

    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "/admin",
      name: "AdminDashboard",
      component: AdminDashboard
    },
    {
      path: "/newpost",
      name: "NewPost",
      component: NewPost
    },
    {
      path: "/post/:post_id",
      name: "ViewPost",
      component: ViewPost
    }
  ]
});
