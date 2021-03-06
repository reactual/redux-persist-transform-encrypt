import createEncryptor from '../sync';
global.console.error = jest.fn();

describe('sync', () => {
  it('can encrypt incoming state', () => {
    const encryptTransform = createEncryptor({
      secretKey: 'redux-is-awesome'
    });
    const key = 'testState';
    const state = {
      foo: 'bar'
    };
    const newState = encryptTransform.in(state, key);
    expect(typeof newState).toBe('string');
    expect(newState).not.toEqual(state);
  });

  it('can decrypt outgoing state', () => {
    const encryptTransform = createEncryptor({
      secretKey: 'redux-is-awesome'
    });
    const key = 'testState';
    const state = {
      foo: 'bar'
    };
    const encryptedState = encryptTransform.in(state, key);
    const newState = encryptTransform.out(encryptedState, key);
    expect(newState).toEqual(state);
  });

  it('should show a nice error message when an incorrect key is provided', () => {
    const initialEncryptTransform = createEncryptor({
      secretKey: 'super-secret'
    });
    const key = 'testState';
    const state = {
      foo: 'bar'
    };
    const encryptedState = initialEncryptTransform.in(state, key);
    const encryptTransform = createEncryptor({
      secretKey: 'different-secret'
    });
    const newState = encryptTransform.out(encryptedState, key);
    expect(global.console.error).toHaveBeenCalledWith(
      new Error(
        'Could not decrypt state. Please verify that you are using the correct secret key.'
      )
    );
  });
});
