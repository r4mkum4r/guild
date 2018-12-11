import AssignUsers from './assign-users.js';

export default {
  template: `
    <div class="arrangers-list">
      <assign-users :users="arrangers">
        <template slot="user-info" slot-scope="{user}">
         {{user.first_name}} {{user.last_name}}
        </template>
      </assign-users>  
    </div>
  `,
  components: {
    AssignUsers
  },
  data() {
    return {
      arrangers: ARRANGERS
    }
  },
  props: {},
  created() {
    console.log('created');
  },
  mounted() {
    console.log(this);
  }
}
