import ReactDOM from 'react-dom/client';
import { TogglePaywall } from './components/TogglePaywall';

export default defineContentScript({
  matches: ['*://*.meetup.com/*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        root.render(<TogglePaywall />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
