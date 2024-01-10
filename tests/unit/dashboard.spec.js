import axios from 'axios';
import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/Dashboard.vue';
import Vue from 'vue';
import Notifications from 'vue-notification'

Vue.component('notifications', Notifications);

jest.mock('axios');

Vue.prototype.API_PRODUCT = 'http://127.0.0.1:8000/api/product/';
Vue.prototype.API_ORDER = 'http://127.0.0.1:8000/api/order/';
Vue.prototype.API_ALERT = 'http://127.0.0.1:8000/api/alert/';
Vue.prototype.API_CATEGORY = 'http://127.0.0.1:8000/api/category/';
Vue.prototype.API_STATISTIC = 'http://127.0.0.1:8000/api/statistic/';
Vue.prototype.API_LOG = 'http://127.0.0.1:8000/api/auth/log';

describe('Dashboard', () => {
  const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTY4NDM0OTk0MywiZXhwIjoxNjg0MzUzNTQzLCJuYmYiOjE2ODQzNDk5NDMsImp0aSI6Im02THJFbjdVQ05CdllQdEsiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.srcTJEbkmABBNJK24JXQ2DNCseQTT-iIO6mas5t2ffw';
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products, categories, orders, alerts, and logs on created hook', async () => {
    const vm = shallowMount(Dashboard, {
        mocks: {
          $store: {
            state: {
              token: mockToken,
              role: 'user',
            },
          },
          $router: {
            push: jest.fn(),
          },
        },
    });

    const mockProducts = [{ id: 1, name: 'Product' }];
    const mockCategories = [{ id: 1, name: 'Category' }];
    const mockOrders = [{ id: 1, name: 'Order' }];
    const mockAlerts = [{ id: 1, name: 'Alert' }];
    const mockLogs = [{ id: 1, message: 'Log message' }];

    axios.get
         .mockResolvedValueOnce({ data: mockProducts })
         .mockResolvedValueOnce({ data: mockCategories })
         .mockResolvedValueOnce({ data: mockOrders })
         .mockResolvedValueOnce({ data: mockAlerts })
         .mockResolvedValueOnce({ data: mockLogs });

    await vm.vm.getProduct();
    await vm.vm.getCategory();
    await vm.vm.getOrder();
    await vm.vm.getAlert();
    await vm.vm.getLog();

    expect(axios.get).toHaveBeenNthCalledWith(
        2,
        'http://127.0.0.1:8000/api/product/index',
        { headers: { "Authorization": 'Bearer ' + mockToken } }
    );
    expect(vm.vm.products).toEqual(mockProducts);

    expect(axios.get).toHaveBeenNthCalledWith(
        3,
        'http://127.0.0.1:8000/api/category/index',
        { headers: { "Authorization": 'Bearer ' + mockToken } }
    );

    expect(vm.vm.categories).toEqual(mockCategories);

    expect(axios.get).toHaveBeenNthCalledWith(
        4,
        'http://127.0.0.1:8000/api/order/index',
        { headers: { "Authorization": 'Bearer ' + mockToken } }
    );

    expect(vm.vm.orders).toEqual(mockOrders);

    expect(axios.get).toHaveBeenNthCalledWith(
        5,
        'http://127.0.0.1:8000/api/alert/index',
        { headers: { "Authorization": 'Bearer ' + mockToken } }
    );

    expect(vm.vm.alerts).toEqual(mockAlerts);

    expect(axios.get).toHaveBeenNthCalledWith(
        6,
        'http://127.0.0.1:8000/api/auth/log',
        { headers: { Authorization: 'Bearer ' + mockToken } }
    );
    expect(vm.vm.logs).toEqual(mockLogs);
  });

  it('should call getProduct and getLog methods when role is "admin" on getProductByRole method', async () => {
    const vm = shallowMount(Dashboard, {
      mocks: {
        $store: {
          state: {
            token: mockToken,
            role: 'admin'
          },
        },
        $router: {
          push: jest.fn(),
        },
      }
    });

    const mockProducts = [{id: 1, name: 'Product'}];
    const mockCategories = [{id: 1, name: 'Category'}];
    const mockOrders = [{id: 1, name: 'Order'}];
    const mockAlerts = [{id: 1, name: 'Alert 1'}];
    const mockLogs = [{id: 1, message: 'Log message'}];

    axios.get
         .mockResolvedValueOnce({data: mockProducts})
         .mockResolvedValueOnce({data: mockCategories})
         .mockResolvedValueOnce({data: mockOrders})
         .mockResolvedValueOnce({data: mockAlerts})
         .mockResolvedValueOnce({data: mockLogs});

    const getProductSpy = jest.spyOn(vm.vm, 'getProduct');
    const getLogSpy = jest.spyOn(vm.vm, 'getLog');


    await vm.vm.getProductByRole();

    expect(getProductSpy).toHaveBeenCalled();
    expect(getLogSpy).toHaveBeenCalled();
  });
});

