import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nTest from './../config/internalization/i18nTest';

const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18nTest}>
        {children}
      </I18nextProvider>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
