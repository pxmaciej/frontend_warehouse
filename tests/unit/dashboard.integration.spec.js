import { mount } from '@vue/test-utils';
import Dashboard from '@/Dashboard.vue';

describe('Dashboard.vue', () => {
  it('renders all components correctly', async () => {
    const wrapper = mount(Dashboard, {
      mocks: {
        $store: {
          state: {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MDUyNTIyMDEsImV4cCI6MTcwNTI1NTgwMSwibmJmIjoxNzA1MjUyMjAxLCJqdGkiOiJ0WFdzM0lWREg0TkpmUXVwIiwic3ViIjoiOCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.8vvox5xJOVdCETKJ4ZJ8DPwN7uOWGtIJ6P00vAElv_Y',
            role: 'user',
          },
        },
        $router: {
          push: jest.fn(),
        },
      },
    });

    const crudProductComponent = wrapper.find({ name: 'crudProduct' });
    const crudCategoryComponent = wrapper.find({ name: 'crudCategory' });
    const crudOrderComponent = wrapper.find({ name: 'crudOrder' });

    expect(crudProductComponent.exists()).toBe(true);
    expect(crudCategoryComponent.exists()).toBe(true);
    expect(crudOrderComponent.exists()).toBe(true);
  });
});
