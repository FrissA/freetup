import { create } from 'zustand';
import { rules, type Rule } from './rules';

interface RuleStore {
  activeRules: Rule[];
  evaluate: (url: string) => void;
}

export const useRuleStore = create<RuleStore>((set) => ({
  activeRules: [],
  evaluate: (url) =>
    set({ activeRules: rules.filter((r) => r.test(url)) }),
}));
