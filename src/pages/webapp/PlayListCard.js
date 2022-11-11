import React from 'react'
import './PlayListCard.css'

function PlayListCard(props) {
    return (
        <>
        <tr className='playlist-row'>
            {props.children}
        </tr>
        </>
    )
}

export default PlayListCard
