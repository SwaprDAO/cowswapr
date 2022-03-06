import styled from 'styled-components/macro'
import { Text } from 'rebass'

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`
