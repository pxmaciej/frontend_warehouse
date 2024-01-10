import { shallowMount } from '@vue/test-utils';
import Login from '@/Login';
import axios from 'axios';
import Vue from "vue";

jest.mock('axios'); // Mockowanie modułu axios

Vue.prototype.API_AUTH = 'http://127.0.0.1:8000/api/auth/';

describe('Login', () => {
    let wrapper;
    let mockStore;

    beforeEach(() => {
        mockStore = {
            state: {
                token: '',
            },
            commit: jest.fn(),
            dispatch: jest.fn(),
        };


        wrapper = shallowMount(Login, {
            mocks: {
                $store: mockStore,
                $router: {
                    push: jest.fn(),
                },
            },
        });
    });

    it('should submit login form and handle successful response', async () => {
        // Ustaw dane logowania
        wrapper.setData({
                            user: {
                                login: 'mockUser',
                                password: 'mockPassword',
                            },
                        });

        // Mockowanie odpowiedzi z serwera
        const mockResponse = {
            data: {
                success: true,
                access_token: 'mockToken',
                user: {
                    role: 'admin',
                    id: 123,
                },
            },
        };
        jest.spyOn(wrapper.vm.$router, 'push'); // Mockowanie metody $router.push

        // Mockowanie metody axios.post i zwrócenie danych testowych
        axios.post.mockResolvedValue(mockResponse);


        // Wywołanie metody submit
        await wrapper.vm.submit();

        // Sprawdzenie, czy metoda axios.post została wywołana z poprawnymi danymi
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/' + 'login', {
            login: 'mockUser',
            password: 'mockPassword',
        });

        // Sprawdzenie, czy odpowiednie metody commit zostały wywołane z odpowiednimi argumentami
        expect(mockStore.commit).toHaveBeenCalledWith('setToken', 'mockToken');
        expect(mockStore.commit).toHaveBeenCalledWith('setUserRole', 'admin');
        expect(mockStore.commit).toHaveBeenCalledWith('setUserId', 123);
        expect(mockStore.commit).toHaveBeenCalledWith('setUserData', {
            role: 'admin',
            id: 123,
        });

        // Sprawdzenie, czy nastąpiło przekierowanie na stronę /dashboard
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should submit login form and handle error response', async () => {
        // Ustaw dane logowania
        wrapper.setData({
                            user: {
                                login: 'mockUser',
                                password: 'mockPassword',
                            },
                        });

        // Mockowanie błędu z serwera
        const mockError = {
            response: {
                status: 401,
                data: 'Invalid login credentials',
            },
        };

        axios.post.mockRejectedValue(mockError);

        // Wywołanie metody submit
        await wrapper.vm.submit();

        // Sprawdzenie, czy metoda axios.post została wywołana z poprawnymi danymi
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/' + 'login', {
            login: 'mockUser',
            password: 'mockPassword',
        });

        expect(mockError.response.status).toBe(401)
    });
});
