import db from './database'
import sigUtil from 'eth-sig-util'
import agreement from '../Agreement.txt'

const verify = (usr, sig) => {
  const signee = sigUtil.recoverTypedSignature({
    data: [{ type: 'string', name: 'Agreement', value: agreement }],
    sig
  })
  return (signee.toLowerCase() === usr.toLowerCase())
}

const auth = (req, res, next) => {
  console.log(`${new Date().toISOString()} AUTH: new req received for ${req.path}`)

  let id = req.universalCookies.get('bjvm_id') // id for IDentifier aka account
  let ag = req.universalCookies.get('bjvm_ag') // ag for AutoGraph aka signature
  if (! id || id.length !== 42 || ! ag || ag.length !== 132) { // or id is a valid eth address or ag isn't valid
    console.log(`${new Date().toISOString()} no signature, aborting...`)
    return res.json({ message: "I need your autograph before you can play" })
  }

  id = id.toLowerCase()
  ag = ag.toLowerCase()

  if (!verify(id, ag)) { // autograph is valid
    console.log(`${new Date().toISOString()} Player ${id} provided an invalid signature`)
    return res.json({ message: "Sorry bud, this autograph don't look right" })
  }

  db // save this id & ag in our database if it's not there already
  .query(`SELECT * FROM bjvm_players where account='${id}';`)
  .then(rows=>{ if (rows.length === 0) db.saveSig(id, ag) }) 
  .catch(console.error)

  console.log(`${new Date().toISOString()} Player ${id} Successfully Authenticated!`)

  req.id = id
  req.ag = ag
  return next()
}

export default auth
