import { useEffect } from 'react';
import { useRuleStore } from './store';
import { TogglePaywall } from './components/TogglePaywall';

const componentMap: Record<string, React.FC> = {
  TogglePaywall,
};

export function App() {
  const { activeRules, evaluate } = useRuleStore();

  useEffect(() => {
    evaluate(window.location.href);
  }, [evaluate]);

  return (
    <>
      {activeRules.map((rule) => {
        const Component = componentMap[rule.componentKey];
        return Component ? <Component key={rule.id} /> : null;
      })}
    </>
  );
}
