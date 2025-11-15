import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupNotificationSystemListener } from './utils/notificationSystemListener'

setupNotificationSystemListener();

createRoot(document.getElementById("root")!).render(<App />);
