import React from 'react'
import "../webapp/WebApp.css"

function Message({note}) {
  return (
    <div className='message'>{note}</div>
  )
}

export default Message