import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import store, { persistor } from './redux/store.tsx'; // Import store as default and persistor as named
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>,
);
