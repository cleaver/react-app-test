import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import { Login } from './login';
import { LoginService } from './services/LoginService';

describe('Login component tests', () => {
  let container: HTMLDivElement;
  const loginServiceSpy = jest.spyOn(LoginService.prototype, 'login');

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('Renders initial document', () => {
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(3);
    expect(inputs[0].name).toBe('login');
    expect(inputs[1].name).toBe('password');
    expect(inputs[2].value).toBe('Login');

    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();
  });

  it('Renders initial document with data-test query', () => {
    expect(
      container.querySelector('[data-test="login-form"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-test="login-input"]')?.getAttribute('name')
    ).toBe('login');
    expect(
      container
        .querySelector('[data-test="password-input"]')
        ?.getAttribute('name')
    ).toBe('password');
  });

  it('passes credentials correctly', () => {
    const inputs = container.querySelectorAll('input');
    const loginInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];
    fireEvent.change(loginInput, { target: { value: 'someUser' } });
    fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
    fireEvent.click(loginButton);
    expect(loginServiceSpy).toBeCalledWith('someUser', 'somePassword');
  });

  it('renders status label - invalid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(false);
    const inputs = container.querySelectorAll('input');
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() => expect(loginServiceSpy).toBeCalled());
    const statusLabel = container.querySelector('label');
    expect(statusLabel).toBeInTheDocument();
    expect(statusLabel).toHaveTextContent('Login failed');
  });

  it('renders status label - valid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(true);
    const inputs = container.querySelectorAll('input');
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() => expect(loginServiceSpy).toBeCalled());
    const statusLabel = container.querySelector('label');
    expect(statusLabel).toBeInTheDocument();
    expect(statusLabel).toHaveTextContent('Login successful');
  });
});
