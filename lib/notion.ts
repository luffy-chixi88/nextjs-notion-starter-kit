import { isPreviewImageSupportEnabled, navigationLinks, navigationStyle } from './config'
import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

const getNavigationLinkPages = pMemoize(async (): Promise<ExtendedRecordMap[]> => {
  const navigationLinkPageIds = (navigationLinks || []).map((link) => link.pageId).filter(Boolean)

  if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
    return pMap(
      navigationLinkPageIds,
      async (navigationLinkPageId) =>
        notion.getPage(navigationLinkPageId, {
          chunkLimit: 1,
          fetchMissingBlocks: false,
          fetchCollections: false,
          signFileUrls: false
        }),
      {
        concurrency: 4
      }
    )
  }

  return []
})

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)

  const signedUrls = await getSignedUrls(recordMap)
  ;(recordMap as any).signed_urls = signedUrls

  if (navigationStyle !== 'default') {
    // ensure that any pages linked to in the custom navigation header have
    // their block info fully resolved in the page record map so we know
    // the page title, slug, etc.
    const navigationLinkRecordMaps = await getNavigationLinkPages()

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) => mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}

/**
 * This function checks if a given block is of type 'file' or 'pdf'.
 * @param {any} block - The block to check.
 * @return {boolean} - Returns true if the block is of type 'file' or 'pdf', false otherwise.
 */
function isBlockOfTypeFile(block: any): boolean {
  return block.value?.type === 'file' || block.value?.type === 'video'
}

/**
 * This function retrieves signed URLs for all 'file' or 'pdf' type blocks in a given record map.
 * @param {ExtendedRecordMap} recordMap - The record map to retrieve signed URLs for.
 * @return {Promise<any>} - Returns a promise that resolves to an object. The keys of the object are block IDs, and the values are the corresponding signed URLs.
 */
async function getSignedUrls(recordMap: ExtendedRecordMap): Promise<any> {
  // Extract all blocks of type 'file' or 'pdf' from the record map
  const fileBlocks = Object.values(recordMap.block).filter(isBlockOfTypeFile)

  // Initialize an empty object to store the signed URLs
  // eslint-disable-next-line prefer-const
  let signedUrlsObject = {}
  // Iterate over each file block
  for (const block of fileBlocks) {
    // Retrieve the signed URL for the current block
    const signedUrls = await notion.getSignedFileUrls([
      {
        url: block.value.properties.source[0][0],
        permissionRecord: {
          table: 'block',
          id: block.value.id
        }
      }
    ])

    // Store the signed URL in the object, using the block ID as the key
    signedUrlsObject[block.value.id] = signedUrls.signedUrls[0]
  }

  // Log the object containing the signed URLs
  console.log(signedUrlsObject)
  // Return the object containing the signed URLs
  return signedUrlsObject
}
