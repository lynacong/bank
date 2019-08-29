export default {
  groupUser(state, getters, rootState, rootGetters) {
    return rootGetters.usersBak.find(user => user.id == state.groupId)
  },
}