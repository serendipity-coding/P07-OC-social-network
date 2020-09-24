<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href @click.prevent="logout" class="navbar-brand">Groupomania</a>
    <div class="navbar-nav mr-auto">
      <li class="nav-item" v-if="username || isAdmin">
        <router-link to="/home" class="nav-link">
          <i class="fas fa-home fa-2x"></i>
        </router-link>
      </li>
      <li class="nav-item" v-if="isAdmin">
        <router-link to="/admin" class="nav-link">
          <i class="fas fa-user-shield fa-2x"></i>
        </router-link>
      </li>
    </div>
    <div class="navbar-nav ml-auto">
      <li v-if="username" class="nav-item">
        <router-link to="/profile" class="nav-link">
          {{ username }}
          <img class="avatar" v-bind:src="avatar" />
        </router-link>
      </li>
      <li v-if="username" class="nav-item">
        <a class="nav-link nav-link-logout" href @click.prevent="logout">
          <i class="fas fa-sign-out-alt fa-lg"></i> LogOut
        </a>
      </li>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user")).data.name,
      avatar: JSON.parse(localStorage.getItem("user")).data.avatar,
      isAdmin: JSON.parse(localStorage.getItem("user")).data.isAdmin,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.user = "";
      this.$router.push("/");
      window.location.reload();
    },
  },
};
</script>
<style>
.avatar {
  height: 40px;
  width: 40px;
  margin-left: 5px;
  border-radius: 50%;
}
.nav {
  font-size: 1.1em;
}
.nav-link-logout {
  margin-top: 6px;
}
</style>
