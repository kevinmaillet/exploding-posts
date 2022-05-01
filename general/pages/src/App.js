import { Router } from "@reach/router";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import './index.css'

import Posts from './components/posts'

const queryClient = new QueryClient()


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Posts path="/" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;