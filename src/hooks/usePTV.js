import { HmacSHA1 } from 'crypto-js'

const PTV_API_KEY = process.env.REACT_APP_PTV_API_KEY
const PTV_DEV_ID = process.env.REACT_APP_PTV_DEV_ID

const usePTV = () => {
  const calculatePTVSignature = (request) => {
    const signature = HmacSHA1(request, PTV_API_KEY)
    return signature.toString().toUpperCase()
  }

  const fetchPTV = async (request, signature) => {
    const url = `http://timetableapi.ptv.vic.gov.au${request}&signature=${signature}`
    const response = await fetch(url)
    if (response.ok) {
      return await response.json()
    } else {
      console.log('error', response.status)
    }
  }

  const getStops = async (step) => {
    let routeNumber = step.transit.line.short_name
    let headSign = step.transit.headsign
    let departureStop = step.transit.departure_stop.name
    const numStops = step.transit.num_stops
    // console.log(routeNumber)
    // fetch route_id and route_type
    if (routeNumber.includes('/')) routeNumber = routeNumber.replace('/', '-')
    if (routeNumber.includes(' ')) routeNumber = routeNumber.replace(' ', '%20')

    let api_request = `/v3/routes?route_name=${routeNumber}&devid=${PTV_DEV_ID}`
    let signature = calculatePTVSignature(api_request)
    let data = await fetchPTV(api_request, signature)
    // console.log(data)
    const route = data.routes.find((route) => {
      if (routeNumber.includes('%20'))
        routeNumber = routeNumber.replace('%20', ' ')
      if (route.route_number !== '') return route.route_number === routeNumber
      else return route.route_name === routeNumber
    })
    // console.log(route)
    const routeId = route.route_id
    const routeType = route.route_type

    // fetch directionId
    api_request = `/v3/directions/route/${routeId}?devid=${PTV_DEV_ID}`
    signature = calculatePTVSignature(api_request)
    data = await fetchPTV(api_request, signature)
    // console.log(data)
    // console.log(headSign)
    if (headSign.endsWith('Station')) {
      headSign = headSign.slice(0, -8)
    }

    if (step.transit.line.vehicle.name === 'Tram') {
      // Extract the destination when the format is 'origin to destination'
      const stringIndex = headSign.indexOf(' to ')
      if (stringIndex !== -1) headSign = headSign.slice(stringIndex + 4)
    }
    let lineDirection = data.directions.find((direction) =>
      direction.direction_name.startsWith(headSign)
    )

    if (!lineDirection) {
      headSign = headSign.replace('St.', 'St')
      lineDirection = data.directions.find((direction) =>
        direction.direction_name.startsWith(headSign)
      )
    }

    if (!lineDirection) {
      console.log(`Error matching the line direction infomation`)
      return null
    }

    const directionId = lineDirection.direction_id

    // fetch all stops for the route/direction and get the stops between departure and arrival stops
    api_request = `/v3/stops/route/${routeId}/route_type/${routeType}?direction_id=${directionId}&devid=${PTV_DEV_ID}`
    signature = calculatePTVSignature(api_request)
    data = await fetchPTV(api_request, signature)
    // console.log(data)

    if (departureStop.includes(' / '))
      //trim space next to '/'
      departureStop = departureStop.replace(' / ', '/')

    // console.log(departureStop)

    let firstStop
    if (routeType === 0) {
      firstStop = data.stops.find((stop) => {
        if (departureStop.endsWith('Station')) {
          return stop.stop_name === departureStop
        } else {
          return stop.stop_name === departureStop + ' Station'
        }
      })
    } else if (routeType === 1) {
      // it's a tram
      firstStop = data.stops.find((stop) => {
        if (/^\d+/.test(stop.stop_name)) {
          //stop_name start with number
          // console.log('start with number:', stop.stop_name)
          if (/^\d+/.test(departureStop))
            //departureStop start with number
            return (
              Number(departureStop.match(/^\d+/)[0]) ===
              Number(stop.stop_name.match(/^\d+/)[0])
            )
          //departureStop end with number
          else if (/\d+$/.test(departureStop)) {
            return (
              Number(departureStop.match(/\d+$/)[0]) ===
              Number(stop.stop_name.match(/^\d+/)[0])
            )
          } else return stop.stop_name.startsWith(departureStop)
        } //stop_name end with number
        else if (/\d+$/.test(stop.stop_name)) {
          // console.log('end with number:', stop.stop_name)
          if (/^\d+/.test(departureStop))
            //departureStop start with number
            return (
              Number(departureStop.match(/^\d+/)[0]) ===
              Number(stop.stop_name.match(/\d+$/)[0])
            )
          //departureStop end with number
          else if (/\d+$/.test(departureStop)) {
            return (
              Number(departureStop.match(/\d+$/)[0]) ===
              Number(stop.stop_name.match(/\d+$/)[0])
            )
          } else {
            return stop.stop_name.startsWith(departureStop)
          }
        } else return stop.stop_name.startsWith(departureStop)
      })
    } else {
      firstStop = data.stops.find((stop) =>
        stop.stop_name.startsWith(departureStop)
      )
    }

    if (!firstStop) {
      firstStop = data.stops.find((stop) => {
        if (departureStop.includes('Shopping Centre'))
          departureStop = departureStop.replace('Shopping Centre', 'SC')
        if (departureStop.includes('Railway Station'))
          departureStop = departureStop.replace('Railway Station', 'Station')
        return stop.stop_name.startsWith(departureStop)
      })
    }

    if (!firstStop) {
      firstStop = data.stops.find((stop) => {
        if (
          departureStop.includes(' SC') &&
          stop.stop_name.includes('Shopping Centre')
        )
          departureStop = departureStop.replace('SC', 'Shopping Centre')

        return stop.stop_name.startsWith(departureStop)
      })
    }

    if (!firstStop) {
      console.log('Error matching the depature stop name ')
      return null
    }

    const stopList = []
    for (let i = 1; i < numStops; i++) {
      const stop = data.stops.find((stop) => {
        // console.log(stop.stop_sequence)
        return stop.stop_sequence === firstStop.stop_sequence + i
      })

      if (!stop) {
        console.log('Error finding stops information ')
        return null
      } else stopList.push(stop.stop_name)
    }
    return stopList
  }

  return [getStops]
}

export default usePTV
