import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function Github() {

    const [data, setData] = useState({})
    useEffect(()=>{
        fetch('https://api.github.com/users/Nitash-Biswas')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setData(data)

        })
    },[])
  return (
    <div className= 'text-lighttext text-3xl min-h-full font-bold text-center py-5 bg-darkbg'>{` Github`}
        <div className='flex gap-10 p-5'>
            <img className='rounded-full w-1/3 ' src={data.avatar_url} alt={data.name} />
            <div className='flex flex-col justify-center text-left gap-2 text-2xl font-bold sm:text-3xl'>
            <span>{`Name: ${data.name}`}</span>
            <span>{`Repositories: ${data.public_repos}`}</span>
            </div>

        </div>
    </div>
  )
}

export default Github