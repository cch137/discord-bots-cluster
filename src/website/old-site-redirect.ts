import axios from 'axios'
import express from 'express'
import { API_ORIGIN } from '../constants'

const oldSiteRedirect = express.Router()

oldSiteRedirect.use('*', async (req, res) => {
  const tokenItem = (req.headers.cookie || '').split(';').map(c => c.split('=').map(i => i.trim())).find(c => c[0] === 'token')
  if (tokenItem === undefined) {
    res.redirect('https://cch137.link')
    return
  }
  const token = decodeURIComponent(tokenItem[1])
  const { id } = (await axios.put(`https://${API_ORIGIN}/lockers`, { item: token })).data
  res.redirect(`https://cch137.link/api/auth/transfer?passport=${id}`)
})

export default oldSiteRedirect
