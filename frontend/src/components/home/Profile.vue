<template>
  <div class="profile">
    <h1>User profile</h1>
    <div class="card profile-card">
      <img v-bind:src="user.avatar" />
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="card-text">
          {{ user.email }}
        </p>
        <a href="#" class="btn btn-primary">Modify profile</a>
        <a href="#" class="btn btn-danger">Delete profile</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Profile",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")).data
    };
  }
};
</script>
<style scoped>
h1 {
  text-align: center;
  margin-top: 50px;
}
.card {
  margin: 50px auto;
  width: 400px;
  text-align: center;
}
img {
  margin: 10px auto;
  border-radius: 4px;
  padding: 5px;
  width: 250px;
}
</style>
