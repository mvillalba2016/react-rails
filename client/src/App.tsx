import React, { lazy, Suspense } from 'react';
import { Provider, rootStore } from "./stores/Root";
import './App.css';
import 'blueprint-css/dist/blueprint.css';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes to use custom attributes of Blueprint CSS framework
    bp?: string;
  }
}

const Listing = lazy(() => import('./components/PostList'))

function App() {
  return (
    <Provider value={rootStore}>
      <div className="App">
        <Suspense fallback={<p>Loading Reddit Top 50 Component...</p>}>
          <Listing />
        </Suspense>
      </div>
    </Provider>
  );
}

export default App;
