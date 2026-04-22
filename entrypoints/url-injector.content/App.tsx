import { useEffect } from 'react';
import { useRuleStore } from './store';
import { ClickMeButton } from './components/ClickMeButton';

const componentMap: Record<string, React.FC> = {
  ClickMeButton,
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
