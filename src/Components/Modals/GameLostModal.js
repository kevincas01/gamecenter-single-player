import React from 'react'
import BaseModal from './BaseModal'

const GameLostModal = ({ open,closeModal, reset }) => {
  return (
    open?(

      <BaseModal title="You lost" close={closeModal}>
        <p> Try again!</p>
        <button onClick={reset}>Reset the gamee</button>
    </BaseModal>
    ):(
    <></>)
    
  )
}

export default GameLostModal