import Loadable from 'react-loadable'
import Loader from '../react-components/common/Loader'

//
// Route strings.
//
export const homeRoute = '/'
export const causalityChainRoute = '/causalitychainroute'
export const newsRoute = '/newsroute'
export const counterRoute = '/counterroute'
export const commentRoute = '/commentroute'
export const routerRoute = '/routerroute'
export const todoRoute = '/todoroute'
export const multiPartitionRoute = '/multipartitionroute'
export const asyncAppRoute = '/asyncapproute'

//
// The below preserves HMR. Use a static require for development and code splitting for production.
// Loadable does not work with HMR.
//
export const AsyncApp = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/RedditRedux/containers/AsyncApp'), loading: Loader })
  : require('../react-components/RedditRedux/containers/AsyncApp').default

export const Todo = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/Todo'), loading: Loader })
  : require('../react-components/Todo').default

export const NewsForm = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/NewsForm'), loading: Loader })
  : require('../react-components/NewsForm').default

export const RouterForm = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/RouterForm'), loading: Loader })
  : require('../react-components/RouterForm').default

export const CommentForm = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/CommentForm'), loading: Loader })
  : require('../react-components/CommentForm').default

export const CounterForm = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/CounterForm'), loading: Loader })
  : require('../react-components/CounterForm').default

export const MultiPartition = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/MultiPartition'), loading: Loader })
  : require('../react-components/MultiPartition').default

export const AjaxDemoCausalityChain = process.env.NODE_ENV === 'production'
  ? Loadable({ loader: () => import('../react-components/AjaxDemoCausalityChain'), loading: Loader })
  : require('../react-components/AjaxDemoCausalityChain').default
