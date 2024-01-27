import React from 'react'
import EventCard from '../event/EventCard'

export default function MyTickets() {
  return (
    <div className="w-full px-4 border rounded-md">
          <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
            Upcoming Events
          </h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
          <br />
          <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
            Previous Events
          </h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
        </div>
  )
}
