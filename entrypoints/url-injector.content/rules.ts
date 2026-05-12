export interface Rule {
  id: string;
  /** Returns true when this rule should activate */
  test: (url: string) => boolean;
  /** Unique key for the React component to mount */
  componentKey: string;
}

export const rules: Rule[] = [
  {
    id: 'contains-m',
    test: (url) => url.includes('meetup.com'),
    componentKey: 'ClickMeButton',
  },
];
