import axios from 'axios';
import AuthService from '@/services/AuthService';

jest.mock('axios');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call API to refresh token and update store when token is not empty', async () => {
    const vm = {
      $store: {
        state: {
          token: 'myToken',
        },
        commit: jest.fn(),
      },
      $emit: jest.fn(),
      $router: {
        push: jest.fn(),
      },
    };

    const mockData = {
      data: {
        access_token: 'newToken',
        user: {
          role: 'admin',
          id: 1,
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    await AuthService.isAuthenticated(vm);

    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/refresh', {
      headers: {
        Authorization: 'Bearer myToken',
      },
    });

    expect(vm.$store.commit).toHaveBeenCalledWith('setToken', 'newToken');
    expect(vm.$store.commit).toHaveBeenCalledWith('setUserRole', 'admin');
    expect(vm.$store.commit).toHaveBeenCalledWith('setUserId', 1);
    expect(vm.$store.commit).toHaveBeenCalledWith('setUserData', { role: 'admin', id: 1 });
    expect(vm.$emit).toHaveBeenCalledWith('isLogged');
    expect(vm.$router.push).not.toHaveBeenCalled();
  });

  it('should clear token and navigate to login page when API call fails', async () => {
    const vm = {
      $store: {
        state: {
          token: 'myToken',
        },
        commit: jest.fn(),
      },
      $emit: jest.fn(),
      $router: {
        push: jest.fn(),
      },
    };

    const mockError = {
      response: {
        data: 'Error message',
      },
    };

    axios.get.mockRejectedValueOnce(mockError);

    await AuthService.isAuthenticated(vm);

    expect(vm.$store.commit).toHaveBeenCalledWith('clearToken');
    expect(vm.$emit).toHaveBeenCalledWith('isLoggedOut');
    expect(vm.$router.push).toHaveBeenCalledWith('/login');
  });

  it('should navigate to login page when token is empty', async () => {
    const vm = {
      $store: {
        state: {
          token: '',
        },
        commit: jest.fn(),
      },
      $emit: jest.fn(),
      $router: {
        push: jest.fn(),
      },
    };

    await AuthService.isAuthenticated(vm);

    expect(vm.$emit).toHaveBeenCalledWith('isLoggedOut');
    expect(vm.$router.push).toHaveBeenCalledWith('/login');
  });
});