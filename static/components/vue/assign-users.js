export default {
  template: `
    <div class="users-list">
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
  }
}