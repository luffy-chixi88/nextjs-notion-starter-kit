import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import Btn from '../Btn'
import { getBlockType } from '@/hooks/useBlockType'
import { useDataBase } from '@/hooks/useDataBase'
import cs from 'classnames'
import { CalloutBlock, ExtendedRecordMap } from 'notion-types'
import Modal from 'react-modal'
import { NotionBlockRenderer, useNotionContext } from 'react-notion-x'

interface iTableSchema {
  Name: string
  Title: string // 链接名称
  TitleUrl: string // 链接
  Icon: string // 默认图标
  IconAct: string // 选中图标
}

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
  } else if (block?.type === 'collection_view') {
    result['PasstoNavLink'] = block
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
    borderRadius: '0px 0px 16px 16px',
    top: 'var(--notion-header-height)'
  },
  content: {
    top: 0,
    left: '0',
    right: '0',
    bottom: '0',
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
  const { recordMap, mapPageUrl } = useNotionContext()
  const callouts = findCalloutInContent({
    block,
    recordMap,
    names: ['Logo', 'Language', 'NavButton', 'NavButtonMobile', 'PasstoNavLink', 'SolutionNavlist']
  })
  const router = useRouter()

  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [isSolutionAct, setIsSolution] = React.useState(false)

  // @ts-ignore
  const navList = useDataBase<iTableSchema>({ block: callouts.PasstoNavLink })
  const toggleModal = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const handleSolution = () => {
    setIsSolution((isOpen) => !isOpen)
  }

  const navLink = useMemo(() => {
    return navList.map((item, i) => {
      // 是否已选中
      const newHref =
        item.TitleUrl.indexOf('?pvs') === -1 ? item.TitleUrl : mapPageUrl(item.TitleUrl)
      const isActive = '/' + (router?.query?.pageId || '') === newHref
      const isSolution = item.Name === 'solution'
      return (
        <div
          key={i}
          className={cs('relative', {
            solutionItem: isSolution,
            solutionItemAct: isSolution && isSolutionAct
          })}
        >
          <Btn
            className={cs('notion-link', { active: isActive })}
            href={item.TitleUrl}
            onClick={() => {
              console.log('isSolution', isSolution)
              if (isSolution) {
                handleSolution()
              }
            }}
          >
            <div className='icon-nav mr-4 lg:hidden flex items-center'>
              <Image
                src={isActive ? item.IconAct : item.Icon}
                width={24}
                height={24}
                alt={item.Title}
              />
            </div>
            <p className='title'>{item.Title}</p>
          </Btn>
          {item.Name === 'solution' && (
            <div className='detail'>
              <NotionBlockRenderer blockId={callouts['SolutionNavlist'].id} />
            </div>
          )}
        </div>
      )
    })
  }, [navList, router, mapPageUrl, callouts, isSolutionAct])

  return (
    <header className={cs('notion-header', className)}>
      <div className='notion-nav-header flex justify-between'>
        <div className='flex items-center'>
          {callouts['Logo'] && (
            <div className='logo'>
              <Btn href='/'>
                <NotionBlockRenderer blockId={callouts['Logo'].id} />
              </Btn>
            </div>
          )}
        </div>
        <div className='option flex items-center justify-end flex-1 max-lg:hidden self-stretch'>
          <div className='pt-nav-link'>{navLink}</div>
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
            <div className='pt-nav-link'>{navLink}</div>
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
