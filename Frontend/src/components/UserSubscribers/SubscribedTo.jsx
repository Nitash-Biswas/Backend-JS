import React from 'react'
import ChannelCard from '../Card/ChannelCard'

function SubscribedTo({channels}) {
  return (
    <div className="bg-darkbg p-4">
      {channels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {channels.map((channel) => (
            <ChannelCard
              key={channel._id}
              fullname={channel.fullname}
              username={channel.username}
              avatar={channel.avatar}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No Subcribers found</h1>
          <p className="text-darktext">There are no subcribers available.</p>
        </div>
      )}
    </div>
  )
}

export default SubscribedTo