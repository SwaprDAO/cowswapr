import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Suspense, /* PropsWithChildren, */ ReactNode, useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import AddressClaimModal from 'components/claim/AddressClaimModal'
import ErrorBoundary from 'components/ErrorBoundary'
import Header from 'components/Header'
import Polling from 'components/Header/Polling'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/Web3ReactManager'
import { ApplicationModal } from 'state/application/reducer'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import DarkModeQueryParamReader from 'theme'
import ReferralLinkUpdater from 'state/affiliate/updater'
import URLWarning from 'components/Header/URLWarning'
import Footer from 'components/Footer'
import { BodyWrapper } from '.'
import * as CSS from 'csstype' // mod

interface AppWrapProps {
  bgBlur?: boolean
}

const AppWrapper = styled.div<Partial<CSS.Properties & AppWrapProps>>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100vh;
  overflow-x: hidden;
  &:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    filter: blur(20px);
    backdrop-filter: blur(20px);
    background-image: ${({ theme }) => theme.body.background};
    opacity: 0;
    transition: 0.5s;
  }
  ${(props) => (props.bgBlur ? '&:after {opacity: 1}' : '&:after {opacity:0}')};
`

/* const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 6rem 16px 16px 16px;
  `};
` */

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const FooterWrapper = styled(HeaderWrapper)`
  z-index: 1;
  width: auto;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export default function App(props?: { children?: ReactNode }) {
  const [bgBlur, setBgBlur] = useState(false)
  const location = useLocation()
  useEffect(() => {
    setBgBlur(location.pathname.length > 1 && location.pathname !== '/swap')
  }, [location.pathname])
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Route component={DarkModeQueryParamReader} />
        <Route component={ApeModeQueryParamReader} />
        <Web3ReactManager>
          <AppWrapper bgBlur={bgBlur}>
            <Popups />
            <URLWarning />
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Polling />
              <TopLevelModals />
              <ReferralLinkUpdater />
              <Switch>{props && props.children}</Switch>
              <Marginer />
            </BodyWrapper>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
          </AppWrapper>
        </Web3ReactManager>
      </Suspense>
    </ErrorBoundary>
  )
}
