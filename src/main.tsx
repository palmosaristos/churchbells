import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupNotificationSystemListener } from './utils/notificationSystemListener'
import i18n from './i18n/config'

setupNotificationSystemListener();

// S'assurer que i18n est prêt avant de rendre l'app
const timeout = setTimeout(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}, 100);

if (i18n.isInitialized) {
  clearTimeout(timeout);
  createRoot(document.getElementById("root")!).render(<App />);
}
