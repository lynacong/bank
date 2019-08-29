export function groupAdapter(list) {
  return list.map(o => {
    o.name = o.name || o.group_name
    o.id = o.id || o.group_id
    o.users = o.users || o.groupusers
    o.group_introduction = o.group_introduction || ''
    o.users.forEach(o => {
      o.name = o.name || o.user_name
      o.id = o.id || o.user_id
      o.department = ''
      o.telephone = ''
      o.photo = ''
    })
    return o
  })
}