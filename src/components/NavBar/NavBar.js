import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const route = useRoute()

    const currentRoute = computed(() => {
      return route.path
    })

    return {
      currentRoute
    }
  }
}
