import React from 'react'
import './PlayListCard.css'

function PlayListCard(props) {
    return (
        <>
        <div className='playlist-card'>
            {props.children}
        </div>
        </>
    )
}

export default PlayListCard
