import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'

import { getNetworkLibrary } from 'connectors'
import { fetchTokenList } from 'state/lists/actions'
import getTokenList from 'utils/getTokenList'
import resolveENSContentHash from 'utils/resolveENSContentHash'
import { useActiveWeb3React } from 'hooks/web3'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const ensResolver = useCallback(
    async (ensName: string) => {
      if (!library || chainId !== 1) {
        const networkLibrary = getNetworkLibrary()
        const network = await networkLibrary.getNetwork()
        if (networkLibrary && network.chainId === 1) {
          return resolveENSContentHash(ensName, networkLibrary)
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      // Mod: add chainId
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl, chainId }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          // Mod: add chainId
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId, chainId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            // Mod: add chainId
            dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message, chainId }))
          throw error
        })
    },
    // Mod: add chainId
    // [dispatch, ensResolver]
    [chainId, dispatch, ensResolver]
  )
}
