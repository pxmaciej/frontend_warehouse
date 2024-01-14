import { mount } from '@vue/test-utils';
import OrderList from '@/OrderList.vue';

describe('OrderList.vue', () => {
  it('renders all components correctly', async () => {
    const wrapper = mount(OrderList, {
      mocks: {
        $store: {
          state: {
            token: '',
            role: 'user',
          },
        },
        $router: {
          push: jest.fn(),
        },
      },
    });

    const crudSelectProductComponent = wrapper.find({ name: 'crudSelectProduct' });
    const crudOrderListComponent = wrapper.find({ name: 'crudOrderList' });

    expect(crudSelectProductComponent.exists()).toBe(true);
    expect(crudOrderListComponent.exists()).toBe(true);
  });
});
