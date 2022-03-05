import { Trans } from '@lingui/macro'
import { Fraction, TradeType } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

import { useCurrency, useToken } from '../../hooks/Tokens'
import {
  ApproveTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionInfo,
  TransactionType,
  WrapTransactionInfo,
} from '../../state/transactions/actions'

function formatAmount(amountRaw: string, decimals: number, sigFigs: number): string {
  return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs)
}

function FormattedCurrencyAmount({
  rawAmount,
  symbol,
  decimals,
  sigFigs,
}: {
  rawAmount: string
  symbol: string
  decimals: number
  sigFigs: number
}) {
  return (
    <>
      {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
    </>
  )
}

function FormattedCurrencyAmountManaged({
  rawAmount,
  currencyId,
  sigFigs = 6,
}: {
  rawAmount: string
  currencyId: string
  sigFigs: number
}) {
  const currency = useCurrency(currencyId)
  return currency ? (
    <FormattedCurrencyAmount
      rawAmount={rawAmount}
      decimals={currency.decimals}
      sigFigs={sigFigs}
      symbol={currency.symbol ?? '???'}
    />
  ) : null
}

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  const token = useToken(info.tokenAddress)

  return <Trans>Approve {token?.symbol}</Trans>
}

function WrapSummary({ info: { currencyAmountRaw, unwrapped } }: { info: WrapTransactionInfo }) {
  if (unwrapped) {
    return (
      <Trans>
        Unwrap <FormattedCurrencyAmount rawAmount={currencyAmountRaw} symbol={'WETH'} decimals={18} sigFigs={6} /> to
        ETH
      </Trans>
    )
  } else {
    return (
      <Trans>
        Wrap <FormattedCurrencyAmount rawAmount={currencyAmountRaw} symbol={'ETH'} decimals={18} sigFigs={6} /> to WETH
      </Trans>
    )
  }
}

function SwapSummary({ info }: { info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo }) {
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return (
      <Trans>
        Swap exactly{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.inputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{' '}
        for{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedOutputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </Trans>
    )
  } else {
    return (
      <Trans>
        Swap{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedInputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{' '}
        for exactly{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.outputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </Trans>
    )
  }
}

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.SWAP:
      return <SwapSummary info={info} />

    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />

    case TransactionType.WRAP:
      return <WrapSummary info={info} />

    default:
      return null
  }
}
