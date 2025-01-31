'use client'

import Modal from '@/app/components/modal/Modal'
import Image from 'next/image'

interface ImageModalProps {
  src?: string | null
  isOpen?: boolean
  onClose: () => void
}
const ImageModal = ({ src, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Image
        src={src}
        width={800}
        height={600}
        objectFit='contain'
        alt='image'
        className='p-[20px]'
      />
    </Modal>
  )
}

export default ImageModal
