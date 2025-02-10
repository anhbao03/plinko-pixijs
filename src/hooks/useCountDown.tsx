import { useEffect, useState } from 'react'

const useCountDown = (targetDate: number) => {
  const countDownDate = targetDate

  const [countDown, setCountDown] = useState<number>(
    (countDownDate - new Date().getTime())
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountDown = (countDownDate - new Date().getTime())

      setCountDown(newCountDown)

    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate, countDown])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown: number) => {

  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
  //console.log("seconds: ", seconds)
  return seconds
}

export { useCountDown }
