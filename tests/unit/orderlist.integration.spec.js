import { mount } from '@vue/test-utils';
import OrderList from '@/OrderList.vue';

describe('OrderList.vue', () => {
  it('renders all components correctly', async () => {
    const wrapper = mount(OrderList, {
      mocks: {
        $store: {
          state: {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MDU3ODIzMjYsImV4cCI6MTcwNTc4NTkyNiwibmJmIjoxNzA1NzgyMzI2LCJqdGkiOiJuUERZQUd4ZHkwUG1STEluIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.GM8rHS_gVTmH_TLZLazlE8jUBY_iFiiNhDsPjSv-zCE',
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
