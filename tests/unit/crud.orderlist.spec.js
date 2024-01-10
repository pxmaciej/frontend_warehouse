import { mount } from '@vue/test-utils';
import CrudOrderList from '@/components/crudOrderList';
import axios from 'axios';
import Vue from "vue";

jest.mock('axios'); // Mockowanie modułu axios

Vue.prototype.API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlist/';

Vue.prototype.NOTIFICATION_TEXT_SUCCESS = 'Udało się %s element %s';
Vue.prototype.NOTIFICATION_TEXT_ERROR = 'Nie udało się %s elementu %s';
Vue.prototype.NOTIFICATION_TEXT_CONFIRMATION = 'Jesteś pewny, że chcesz usunąć element';

describe('CrudOrderList', () => {
  let wrapper;
  const mockToken = '';

  beforeEach(() => {
    wrapper = mount(CrudOrderList, {
      mocks: {
        $store: {
          state: {
            token: mockToken,
          },
        },
          notify: jest.fn(),
      },
      propsData: {
        orderList: [
          {
            id: 1,
            name: 'Product 1',
            amount: 5,
            product_id: 1,
          },
          {
            id: 2,
            name: 'Product 2',
            amount: 3,
            product_id: 2,
          },
        ],
        products: [
          {
            id: 1,
            name: 'Product 1',
            amount: 10,
          },
          {
            id: 2,
            name: 'Product 2',
            amount: 8,
          },
        ],
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('deleteItem', () => {
    it('should remove the item from the orderList array and update the product amount', () => {
      // Mock the API requests
      axios.delete.mockResolvedValue();
      axios.patch.mockResolvedValue();

      // Set up the initial data
      const item = {
        id: 1,
        name: 'Product 1',
        amount: 5,
        product_id: 1,
      };
      wrapper.setData({
                        product: {
                          id: 0,
                          amount: 0,
                        },
                      });

      // Trigger the method
      wrapper.vm.deleteItem(item);

      // Check the result
      expect(axios.delete).toHaveBeenCalledWith(
          'http://127.0.0.1:8000/api/orderlist/destroy/1',
          expect.objectContaining({
                                    headers: { Authorization: 'Bearer ' + mockToken },
                                  })
      );

      expect(axios.patch).toHaveBeenCalledWith(
          'http://127.0.0.1:8000/api/product/update/1',
          {
            id: 1,
            amount: 15,
          },
          expect.objectContaining({
                                    headers: { Authorization: 'Bearer ' + mockToken },
                                  })
      );

      expect(wrapper.emitted('submit')).toBeTruthy();
    });

    it('should show success notification when the API requests succeed', () => {
      // Mock the API requests
      axios.delete.mockResolvedValue();
      axios.patch.mockResolvedValue();

      // Set up the initial data
      const item = {
        id: 1,
        name: 'Product 1',
        amount: 5,
        product_id: 1,
      };

      // Trigger the method
       wrapper.vm.deleteItem(item);

      // Check the result
      expect(wrapper.vm.$notify).toHaveBeenCalledWith({
                                                        title: 'Sukces',
                                                        text: 'Item successfully removed from order',
                                                        type: 'success',
                                                        duration: 3000,
                                                        speed: 2000,
                                                      });
    });

    it('should show error notification when the API requests fail', () => {
      // Mock the API requests
      axios.delete.mockRejectedValue();
      axios.patch.mockRejectedValue();

      // Set up the initial data
      // Set up the initial data
      const item = {
        id: 1,
        name: 'Product 1',
        amount: 5,
        product_id: 1,
      };

      // Trigger the method
      wrapper.vm.deleteItem(item);

      // Check the result
      expect(wrapper.vm.$notify).toHaveBeenCalledWith({
                                                        title: 'Błąd',
                                                        text: 'Error occurred while removing the order',
                                                        type: 'error',
                                                        duration: 3000,
                                                        speed: 2000,
                                                      });
    });
  });
});


