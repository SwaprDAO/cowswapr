import { createAction } from '@reduxjs/toolkit'
import { TradeType } from '@uniswap/sdk-core'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP = 1,
  DEPOSIT_LIQUIDITY_STAKING = 2,
  WITHDRAW_LIQUIDITY_STAKING = 3,
  CLAIM = 4,
  VOTE = 5,
  DELEGATE = 6,
  WRAP = 7,
  CREATE_V3_POOL = 8,
  ADD_LIQUIDITY_V3_POOL = 9,
  ADD_LIQUIDITY_V2_POOL = 10,
  MIGRATE_LIQUIDITY_V3 = 11,
  COLLECT_FEES = 12,
  REMOVE_LIQUIDITY_V3 = 13,
  SUBMIT_PROPOSAL = 14,
}

export interface BaseTransactionInfo {
  type: TransactionType
}

export interface VoteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.VOTE
  governorAddress: string
  proposalId: number
  reason: string
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spender: string
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP
  tradeType: TradeType
  inputCurrencyId: string
  outputCurrencyId: string
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT
  inputCurrencyAmountRaw: string
  expectedOutputCurrencyAmountRaw: string
  minimumOutputCurrencyAmountRaw: string
}
export interface ExactOutputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT
  outputCurrencyAmountRaw: string
  expectedInputCurrencyAmountRaw: string
  maximumInputCurrencyAmountRaw: string
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP
  unwrapped: boolean
  currencyAmountRaw: string
}

export interface ClaimTransactionInfo {
  type: TransactionType.CLAIM
  recipient: string
  uniAmountRaw?: string
}

export interface SubmitProposalTransactionInfo {
  type: TransactionType.SUBMIT_PROPOSAL
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactOutputSwapTransactionInfo
  | ExactInputSwapTransactionInfo
  | ClaimTransactionInfo
  | WrapTransactionInfo
  | SubmitProposalTransactionInfo

export const addTransaction = createAction<{
  chainId: number
  hash: string
  from: string
  info: TransactionInfo
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: number }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: number
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: number
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
