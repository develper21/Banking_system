/// <reference types="@jest/types" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveStyle(style: Record<string, any>): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeRequired(): R
      toBeVisible(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | number): R
      toBeChecked(): R
      toBeEmptyDOMElement(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(html: string): R
      toHaveFocus(): R
      toHaveFormValues(values: Record<string, any>): R
      toBePartiallyChecked(): R
      toHaveDisplayValue(value: string | RegExp): R
      toHaveDescription(text: string | RegExp): R
      toHaveRole(role: string): R
      toHaveAccessibleDescription(text: string | RegExp): R
      toHaveAccessibleName(text: string | RegExp): R
      toBeEmpty(): R
      toBeInTheDocument(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toBeVisible(): R
      toHaveErrorMessage(text: string | RegExp): R
    }
  }
}
