import {dereplication} from '../../util/util'
export default {
  SHOW_DISCUSS_BOX(state, show) {
    state.showDiscussBox = show
  },
  GROUP_ID(state, id) {
    state.groupId = id
  },
  GROUP_USERS(state, users) {
    state.groupUsers = users
  },
  PARENT_NODE(state, node) {
    state.parentNode = node
  },
  MAIN_CHAT_ACTIVE_USER_ID_BAK(state, activeUserIdBak) {
    state.mainChatActiveUserIdBak = activeUserIdBak
  },
  CONTAINER_ID(state, containerId) {
    state.containerId = containerId
  },
  IS_CLOSE(state, isClose) {
    state.isClose = isClose
  }
}