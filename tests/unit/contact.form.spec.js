import { shallowMount } from '@vue/test-utils';
import ContactForm from '@/ContactForm.vue';

describe('ContactForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ContactForm);
  });

  it('should render the form correctly', () => {
    expect(wrapper.find('v-card-title').text()).toBe('Send Email');
    expect(wrapper.find('v-text-field[name="name"]').exists()).toBe(true);
    expect(wrapper.find('v-text-field[name="email"]').exists()).toBe(true);
    expect(wrapper.find('v-textarea[name="message"]').exists()).toBe(true);
    expect(wrapper.find('vue-recaptcha').exists()).toBe(true);
    expect(wrapper.find('v-btn').exists()).toBe(true);
  });

  it('should set valid to true when all fields are filled', () => {
    wrapper.setData({
                      editedItem: {
                        name: 'John Doe',
                        email: 'johndoe@example.com',
                        message: 'Hello, World!',
                      },
                    });

    expect(wrapper.vm.valid).toBe(true);
  });

  it('should display a warning notification when form is submitted with invalid fields', () => {
    // Fill only some fields
    wrapper.setData({
                      editedItem: {
                        name: 'John Doe',
                        email: '',
                        message: '',
                      },
                    });

    // Trigger form submission
    wrapper.vm.sendEmail();
  });

  it('should call emailjs.sendForm and display success notification when form is submitted with valid fields', () => {
    // Mock emailjs.sendForm
    const emailjsSendFormMock = jest.spyOn(emailjs, 'sendForm').mockImplementation(() => {});

    // Fill all fields
    wrapper.setData({
                      editedItem: {
                        name: 'John Doe',
                        email: 'johndoe@example.com',
                        message: 'Hello, World!',
                      },
                    });

    // Trigger form submission
    wrapper.vm.sendEmail();

    // Check emailjs.sendForm was called
    expect(emailjsSendFormMock).toHaveBeenCalled();

    // Check the success notification
    expect(wrapper.vm.$notify).toHaveBeenCalledWith(
        expect.objectContaining({
                                  title: 'Success',
                                  text: 'Success send Message',
                                  type: 'success',
                                  duration: 3000,
                                  speed: 1000,
                                }),
    );

    // Check the form fields were cleared
    expect(wrapper.vm.editedItem.name).toBe('');
    expect(wrapper.vm.editedItem.email).toBe('');
    expect(wrapper.vm.editedItem.message).toBe('');
  });

  it('should display an error notification when emailjs.sendForm throws an error', () => {
    // Mock emailjs.sendForm to throw an error
    const mockError = new Error('Email send failed');
    jest.spyOn(emailjs, 'sendForm').mockImplementation(() => {
      throw mockError;
    });

    // Fill all fields
    wrapper.setData({
                      editedItem: {
                        name: 'John Doe',
                        email: 'johndoe@example.com',
                        message: 'Hello, World!',
                      },
                    });

    // Trigger form submission
    wrapper.vm.sendEmail();

    // Check the error notification
    expect(wrapper.vm.$notify).toHaveBeenCalledWith(
        expect.objectContaining({
                                  title: 'Error',
                                  text: 'Something wrong!',
                                  type: 'error',
                                  duration: 3000,
                                  speed: 1000,
                                }),
    );

    // Check the console log for the error
    expect(console.log).toHaveBeenCalledWith({ error: mockError });
  });
});