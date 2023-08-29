import { app } from '../server'
import axios from 'axios'

app.use('*', async (req, res) => {
  const tokenItem = (req.headers.cookie || '').split(';').map(c => c.split('=').map(i => i.trim())).find(c => c[0] === 'token')
  if (tokenItem === undefined) {
    res.redirect('https://cch137.link')
    return
  }
  const token = decodeURIComponent(tokenItem[1])
  const { id } = (await axios.put('https://cch137-api.onrender.com/lockers', { item: token })).data
  res.redirect(`https://cch137.link/api/auth/transfer?passport=${id}`)
})

export default () => console.log('All paths will be redirected to cch137.link.');
