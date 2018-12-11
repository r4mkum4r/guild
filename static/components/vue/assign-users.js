export default {
  template: `
    <div class="users-list">
      <hello-world></hello-world>
      <div class="input-group" v-for="user in users" :key="user.id">
        <input type="checkbox" class="user-selection" :value="user.user_id" :id="user.user_id">
        <label :for="user.user_id">
          <slot name="user-info" :user="user"></slot>
        </label>
      </div>
    </div>
  `,
  data() {
    return {};
  },
  props: {
    users: Array
  },
  created() {
    console.log('created');
  },
  mounted() {
    console.log(this);
  }
}
