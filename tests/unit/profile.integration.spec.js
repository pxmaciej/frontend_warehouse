import { mount } from '@vue/test-utils';
import Profile from '@/Profile.vue';

describe('Profile.vue', () => {
  it('renders all components correctly', async () => {
    const wrapper = mount(Profile, {
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
    const formProfileComponent = wrapper.find({ name: 'formProfile' });
    const profileDataComponent = wrapper.find({ name: 'profileData' });

    expect(formProfileComponent.exists()).toBe(true);
    expect(profileDataComponent.exists()).toBe(true);
  });
});
