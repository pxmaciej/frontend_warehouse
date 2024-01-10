import { mount } from '@vue/test-utils';
import FormProfile from '@/components/formProfile';

describe('FormProfile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FormProfile, {
      mocks: {
        $store: {
          state: {
            userId: '',
            token: '',
            role: ''
          },
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the component properly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should have initial data properties set correctly', () => {
    expect(wrapper.vm.valid).toBe(false);
    expect(wrapper.vm.name).toBe('');
    expect(wrapper.vm.login).toBe('');
    expect(wrapper.vm.phone).toBe('');
    expect(wrapper.vm.password).toBe('');
    expect(wrapper.vm.password_confirmation).toBe('');
    expect(wrapper.vm.roles).toEqual(['user', 'admin']);
    expect(wrapper.vm.role).toBe('');
    expect(wrapper.vm.editedItem.id).toBe('');
    expect(wrapper.vm.editedItem.name).toBe('');
    expect(wrapper.vm.editedItem.login).toBe('');
    expect(wrapper.vm.editedItem.phone).toBe('');
    expect(wrapper.vm.editedItem.password).toBe('');
    expect(wrapper.vm.editedItem.password_confirmation).toBe('');
  });

  it('should validate the name field correctly', () => {
    // Valid name
    wrapper.setData({ name: 'John Doe' });
    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    // Empty name
    wrapper.setData({ name: '' });
    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('should validate the login field correctly', () => {
    // Valid login
    wrapper.setData({ login: 'johndoe' });
    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    // Empty login
    wrapper.setData({ login: '' });
    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('should validate the phone field correctly', () => {
    // Valid phone number
    wrapper.setData({ phone: '+48123456789' });
    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    // Invalid phone number
    wrapper.setData({ phone: '12345' });
    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('should validate the password fields correctly', () => {
    // Valid passwords
    wrapper.setData({
                      password: 'password123',
                      password_confirmation: 'password123'
                    });
    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    // Invalid passwords
    wrapper.setData({
                      password: 'password123',
                      password_confirmation: 'password456'
                    });
    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('should call the API to update the profile when submitting the form', async () => {
    // Mock the API request
    const mockResponse = { status: 'success' };
    const axiosPatchMock = jest.spyOn(wrapper.vm.$axios, 'patch').mockResolvedValue(mockResponse);

    // Set up the form data
    wrapper.setData({
                      valid: true,
                      name: 'John Doe',
                      login: 'johndoe',
                      phone: '+48123456789',
                      password: 'password123',
                      password_confirmation: 'password123',
                    });

    // Trigger the form submission
    await wrapper.vm.submit();

    // Check the API call
    expect(axiosPatchMock).toHaveBeenCalledWith(
        expect.stringContaining('update'),
        expect.objectContaining({
                                  id: '',
                                  name: 'John Doe',
                                  login: 'johndoe',
                                  phone: '48123456789',
                                  password: 'password123',
                                  password_confirmation: 'password123',
                                }),
        expect.objectContaining({
                                  headers: {
                                    'Authorization': 'Bearer ',
                                  },
                                }),
    );

    // Check the emitted event
    expect(wrapper.emitted('submit')).toBeTruthy();

    // Check the notification
    expect(wrapper.vm.$notify).toHaveBeenCalledWith(
        expect.objectContaining({
                                  title: 'Sukces',
                                  text: expect.any(String),
                                  type: 'success',
                                  duration: 3000,
                                  speed: 2000,
                                }),
    );
  });

  it('should show an error notification when the API request fails', async () => {
    // Mock the API request
    const mockError = new Error('API request failed');
    const axiosPatchMock = jest.spyOn(wrapper.vm.$axios, 'patch').mockRejectedValue(mockError);

    // Set up the form data
    wrapper.setData({
                      valid: true,
                      name: 'John Doe',
                      login: 'johndoe',
                      phone: '+48123456789',
                      password: 'password123',
                      password_confirmation: 'password123',
                    });

    // Trigger the form submission
    await wrapper.vm.submit();

    // Check the API call
    expect(axiosPatchMock).toHaveBeenCalledWith(
        expect.stringContaining('update'),
        expect.objectContaining({
                                  id: '',
                                  name: 'John Doe',
                                  login: 'johndoe',
                                  phone: '48123456789',
                                  password: 'password123',
                                  password_confirmation: 'password123',
                                }),
        expect.objectContaining({
                                  headers: {
                                    'Authorization': 'Bearer ',
                                  },
                                }),
    );

    // Check the error handling
    expect(console.log).toHaveBeenCalledWith(mockError);

    // Check the notification
    expect(wrapper.vm.$notify).toHaveBeenCalledWith(
        expect.objectContaining({
                                  title: 'Błąd',
                                  text: expect.any(String),
                                  type: 'error',
                                  duration: 3000,
                                  speed: 2000,
                                }),
    );
  });
});

