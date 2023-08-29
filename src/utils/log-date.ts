function logDate (event = 'Started at', timeMs: number) {
  console.log(`${event}:`, new Date(timeMs).toString())
}

export default logDate
