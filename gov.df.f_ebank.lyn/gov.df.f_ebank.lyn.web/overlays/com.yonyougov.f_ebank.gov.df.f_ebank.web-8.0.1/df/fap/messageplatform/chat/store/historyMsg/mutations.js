import {dereplication} from '../../util/util'
export default {
  ALL_MSGS(state, {msgs=[], replaceFlag=false, end = false, pageNum = 1, loading = false}) {
    if(!replaceFlag) {  // 没有切换用户
      let {allMsgs, dateStr} = state
      allMsgs[dateStr] = allMsgs[dateStr] || {}
      let loadedMsgs = allMsgs[dateStr].msgs || []
      msgs = dereplication(loadedMsgs.concat(msgs), 'msg_id')

      // state.allMsgs = dereplication(state.allMsgs.concat(msgs), 'msg_id')
    } else {
      state.allMsgs = {}
    }
    state.allMsgs = {
      ...state.allMsgs,
      [state.dateStr]: {
        msgs,
        pageNum,
        end,
        loading,
      },
    }
  },
  DATE_STR(state, dateStr) {
    state.dateStr = dateStr
  },
}