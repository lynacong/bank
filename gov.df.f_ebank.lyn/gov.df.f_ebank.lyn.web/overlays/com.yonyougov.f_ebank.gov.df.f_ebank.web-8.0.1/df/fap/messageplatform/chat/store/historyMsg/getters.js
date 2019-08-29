export default {
  oneDayMsgs(state, getters, rootState) {
    return (state.allMsgs[state.dateStr] || {msgs: []}).msgs
      .filter(msg => {
        return msg.time.indexOf(state.dateStr) > -1 && (msg.fromuserid === rootState.activeUserId || msg.fromuserid === rootState.myUserId)
      })
      .sort((a, b) => a.time > b.time)
  },
}