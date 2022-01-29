import React from 'react'
import './PlayListCard.css'

function PlayListCard(props) {
    return (
        <>
        <div className='playlist-card'style={{background: props.background}}>
            {props.children}
        </div>
        </>
    )
}

export default PlayListCard
