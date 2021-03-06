// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Head from 'next/head';
import Container from 'reactstrap/lib/Container';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';
import * as fakeFetchActions from '../redux/modules/fakeModuleWithFetch';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header';
import { type GetInitialPropsParams } from '../types/nextjs';
import appConfig from '../config/appConfig';

// #region types
type Props = {
  // fakeModuleWithFetch:
  isFetching: boolean,
  fakeData: any,
  fakeFetchIfNeeded: () => Promise<any>,
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
};
// #endregion

// #region constants
const {
  og: { description: ogDescription, locale: ogLang },
  seo: { description: seoDescription },
} = appConfig.metas;
// #endregion

// #region styled components
const Page = styled.div``;
// #endregion

export function IndexPage({ isFetching }: Props) {
  const { push } = useRouter();

  // # region callbacks
  const goLogin = useCallback((event: SyntheticEvent<>) => {
    event && event.preventDefault();
    push('/login');
  }, []);
  // #endregion

  const counter = 2;

  return (
    <Page>
      <Head>
        <title>Index page</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:locale" content={ogLang} />
      </Head>
      <Header />
      <Container fluid>
        <Jumbotron>
          <h1>PWA: Next JS + Redux + Bootstrap STARTER</h1>
          <Button color="primary" onClick={goLogin}>
            login
          </Button>
          &nbsp;
          <Link href="/dynamicPage/[counter]" as={`/dynamicPage/${counter}`}>
            <Button>Dynamic page</Button>
          </Link>
        </Jumbotron>
      </Container>
    </Page>
  );
}

// #region statics
IndexPage.getInitialProps = async function({
  isServer,
  store,
}: GetInitialPropsParams) {
  const SIDE = isServer ? 'SERVER SIDE' : 'FRONT SIDE';

  try {
    const response = await store.dispatch(fakeFetchActions.fakeFetchIfNeeded());
    const {
      payload: { data },
    } = response;
    // NOTE: you will see this log in your server console (where you `npm run dev`):
    /* eslint-disable no-console */
    console.log(`getInitialProps - ${SIDE} - fake fetch result: `, data);

    return { data };
  } catch (error) {
    console.error(`getInitialProps - ${SIDE} - fake fetch failed: `, error);
    /* eslint-enable no-console */
    return { data: null };
  }
};

IndexPage.displayName = 'IndexPage';
// #endregion

// #region redux
const mapStateToProps = state => ({
  isFetching: state.fakeModuleWithFetch.isFetching,
  fakeData: state.fakeModuleWithFetch.data,
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        ...fakeFetchActions,
        ...userAuthActions,
      },
      dispatch,
    ),
  };
};
// #endregion

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(IndexPage);
