import React from 'react'
import BaseModal from './BaseModal'

const GameLostModal = ({ open,closeModal, reset }) => {
  return (
    open?(

      <BaseModal title="You lostttt" close={closeModal}>
        <p> Try againnn</p>
        <button onClick={reset}>Reset the gamee</button>
    </BaseModal>
    ):(
    <></>)
    
  )
}

export default GameLostModal