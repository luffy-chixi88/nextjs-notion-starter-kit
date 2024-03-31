import Image from 'next/image'
import React, { useMemo } from 'react'

import { getBlockType } from '@/hooks/useBlockType'
import cs from 'classnames'
import { CalloutBlock, ExtendedRecordMap } from 'notion-types'
import Modal from 'react-modal'
import { NotionBlockRenderer, useNotionContext } from 'react-notion-x'

export function findCalloutInContent<T extends string>(props: {
  block: any
  recordMap: ExtendedRecordMap
  names: T[]
}) {
  const { block, recordMap, names = [] } = props
  let result: Record<T, CalloutBlock> = {} as Record<T, CalloutBlock>

  if (block?.type === 'callout') {
    const blockType = getBlockType(block)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (names.includes(blockType)) {
      result[blockType] = block
    }
  }
  if (block.content) {
    block.content.forEach((item) => {
      const child = recordMap.block[item].value
      if (child) {
        const res = findCalloutInContent({ block: child, recordMap, names })
        result = {
          ...result,
          ...res
        }
      }
    })
  }
  return result
}

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,.6)',
    top: 'var(--notion-header-height)'
  },
  content: {
    top: 0,
    left: '0',
    right: '0',
    bottom: 'auto',
    transform: 'none',
    position: 'absolute',
    border: 'none',
    borderRadius: '0 0 16px 16px',
    padding: 0,
    paddingBottom: '16px'
  }
}

export default function Nav(props) {
  const { block, className } = props
  const { recordMap } = useNotionContext()
  const callouts = findCalloutInContent({
    block,
    recordMap,
    names: ['Logo', 'Language', 'NavLink', 'NavButton', 'NavButtonMobile']
  })
  const [modalIsOpen, setIsOpen] = React.useState(false)

  const toggleModal = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const navLink = useMemo(() => {
    return callouts['NavLink'].id ? <NotionBlockRenderer blockId={callouts['NavLink'].id} /> : null
  }, [callouts])

  return (
    <header className={cs('notion-header', className)}>
      <div className='notion-nav-header flex justify-between'>
        <div className='flex items-center'>
          {callouts['Logo'] && (
            <div className='logo'>
              <NotionBlockRenderer blockId={callouts['Logo'].id} />
            </div>
          )}
        </div>
        <div className='option flex items-center justify-end flex-1 max-lg:hidden'>
          <div>{navLink}</div>
          {callouts['NavButton'] && (
            <div>
              <NotionBlockRenderer blockId={callouts['NavButton'].id} />
            </div>
          )}
        </div>
        <div className='lg:hidden flex items-center'>
          {callouts['NavButtonMobile'] && (
            <div className='mr-4'>
              <NotionBlockRenderer blockId={callouts['NavButtonMobile'].id} />
            </div>
          )}
          <Image
            onClick={toggleModal}
            src={`/icon/${modalIsOpen ? 'close.svg' : 'menu.svg'}`}
            width={40}
            height={40}
            alt='menu'
            className='cursor-pointer active:opacity-80'
          />
          <Modal
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
          >
            {navLink}
            {callouts['NavButton'] && (
              <div>
                <NotionBlockRenderer blockId={callouts['NavButton'].id} />
              </div>
            )}
          </Modal>
        </div>
      </div>
    </header>
  )
}
