import { mount } from '@vue/test-utils';
import Profile from '@/Profile.vue';

describe('Profile.vue', () => {
  it('renders all components correctly', async () => {
    const wrapper = mount(Profile, {
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
    const formProfileComponent = wrapper.find({ name: 'formProfile' });
    const profileDataComponent = wrapper.find({ name: 'profileData' });

    expect(formProfileComponent.exists()).toBe(true);
    expect(profileDataComponent.exists()).toBe(true);
  });
});
