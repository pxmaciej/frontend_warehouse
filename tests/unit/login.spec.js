import { shallowMount } from '@vue/test-utils';
import Login from '@/Login';
import axios from 'axios';
import Vue from "vue";

jest.mock('axios');

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
        wrapper.setData({
                            user: {
                                login: 'mockUser',
                                password: 'mockPassword',
                            },
                        });

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
        jest.spyOn(wrapper.vm.$router, 'push');

        axios.post.mockResolvedValue(mockResponse);

        await wrapper.vm.submit();

        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/' + 'login', {
            login: 'mockUser',
            password: 'mockPassword',
        });

        expect(mockStore.commit).toHaveBeenCalledWith('setToken', 'mockToken');
        expect(mockStore.commit).toHaveBeenCalledWith('setUserRole', 'admin');
        expect(mockStore.commit).toHaveBeenCalledWith('setUserId', 123);
        expect(mockStore.commit).toHaveBeenCalledWith('setUserData', {
            role: 'admin',
            id: 123,
        });

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should submit login form and handle error response', async () => {
        wrapper.setData({
                            user: {
                                login: 'mockUser',
                                password: 'mockPassword',
                            },
                        });

        const mockError = {
            response: {
                status: 401,
                data: 'Invalid login credentials',
            },
        };

        axios.post.mockRejectedValue(mockError);

        await wrapper.vm.submit();

        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/' + 'login', {
            login: 'mockUser',
            password: 'mockPassword',
        });

        expect(mockError.response.status).toBe(401)
    });
});
