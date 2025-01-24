'use client'
import { User } from '@prisma/client'
import Modal from '../modal/Modal'

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
}

const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose, currentUser }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>Setting</div>
    </Modal>
  )
}

export default SettingModal
