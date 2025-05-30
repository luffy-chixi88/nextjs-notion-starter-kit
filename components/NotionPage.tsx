import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'
import FAQ from '@/components/FAQ'
import Nav from '@/components/Nav'
import PasstoBanner from '@/components/Passto/banner'
import { PasstoCode } from '@/components/Passto/code'
import { PasstoForm } from '@/components/Passto/form'
import { PasstoIntro } from '@/components/Passto/introduce'
import { PasstoManager } from '@/components/Passto/manager'
import { PasstoMermaid } from '@/components/Passto/mermaid'
import { PasstoReadme } from '@/components/Passto/readme'
import { PasstoScence } from '@/components/Passto/scence'
import { PasstoStep } from '@/components/Passto/step'
import TDK from '@/components/TDK'
import VideoAutoPlay from '@/components/Video/autoPlay'
import PasstoVideo from '@/components/Video/video'
import { useBlockType } from '@/hooks/useBlockType'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import cs from 'classnames'
import { PageBlock } from 'notion-types'
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils'
import { NotionRenderer, Text, useNotionContext } from 'react-notion-x'
import TweetEmbed from 'react-tweet-embed'
import { useSearchParam } from 'react-use'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)

const FormatCollection = (props) => {
  const { block } = props
  const { recordMap } = useNotionContext()
  let componentName = recordMap.collection_view?.[block.view_ids?.[0]]?.value?.name
  if (!componentName) {
    componentName = recordMap.collection?.[block.collection_id]?.value?.name?.[0]?.[0]
  }
  switch (componentName) {
    case 'PasstoScence':
    case '收款场景':
      return <PasstoScence {...props} />
    case 'PasstoIntro':
      return <PasstoIntro {...props} />
    case 'PasstoManager':
      return <PasstoManager {...props} />
    default:
      return <Collection {...props} />
  }
}

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false
})
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />
}

const propertyLastEditedTimeValue = ({ block, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = ({ data, schema, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = ({ schema, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

const Callout = (props) => {
  const { block, className, children } = props
  const titleInfo = useBlockType({ block })
  const content = React.useMemo(() => {
    switch (titleInfo.title) {
      case 'Nav':
        return <Nav {...props} meta={titleInfo.meta} />
      case 'PasstoCode':
        return <PasstoCode {...props} meta={titleInfo.meta} />
      case 'PasstoMermaid':
        return <PasstoMermaid {...props} meta={titleInfo.meta} />
      case 'TDK':
        return <TDK {...props} meta={titleInfo.meta} />
      case 'FAQ':
        return <FAQ {...props} meta={titleInfo.meta} />
      case 'PasstoForm':
        return <PasstoForm {...props} meta={titleInfo.meta} />
      case 'PasstoStep':
        return <PasstoStep {...props} meta={titleInfo.meta} />
      case 'PasstoReadme':
        return <PasstoReadme {...props} meta={titleInfo.meta} />
      case 'PasstoVideo':
        return <PasstoVideo {...props} meta={titleInfo.meta} />
      case 'PasstoVideoAutoPlay':
        return <VideoAutoPlay {...props} meta={titleInfo.meta} />
      case 'PasstoBanner':
        return <PasstoBanner {...props} meta={titleInfo.meta} />
      default:
        return (
          <div className='notion-callout-text'>
            <Text value={block.properties?.title} block={block} />
            {children}
          </div>
        )
    }
  }, [block, props, titleInfo, children])

  return (
    <div
      className={cs(
        'notion-callout',
        titleInfo.meta?.className,
        block.format?.block_color && `notion-${block.format?.block_color}_co`,
        className
      )}
    >
      <div className='notion-callout-content'>{content}</div>
    </div>
  )
}

export const NotionPage: React.FC<types.PageProps> = ({ site, recordMap, error, pageId }) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection: FormatCollection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Callout,
      Header: () => null, // 导航读notion模块 NotionPageHeader
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
    }),
    []
  )

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost = block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />,
    [block, recordMap, isBlogPost]
  )

  if (router.isFallback) {
    return <Loading />
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  console.log('notion page', {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap
  })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) || config.description

  return (
    <>
      <Script
        id='PassToAI'
        async
        defer
        src='https://cloud.passto.ai/api/application/embed?protocol=https&host=cloud.passto.ai&token=18d20fd8c7303ca7&hideMask=1'
      ></Script>
      <Script id='pixel-chaty' async src='https://cdn.chaty.app/pixel.js?id=VuhUaGb6'></Script>

      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      <NotionRenderer
        bodyClassName={cs(styles.notion, pageId === site.rootNotionPageId && 'index-page')}
        darkMode={false}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : null}
        pageAside={pageAside}
        footer={null}
        isImageZoomable={false}
      />
    </>
  )
}
