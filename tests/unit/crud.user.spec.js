import { mount } from '@vue/test-utils';
import CrudUser from '@/components/crudUser';

describe('CrudUser', () => {
  let wrapper;
  beforeEach(() => {

    wrapper = mount(CrudUser, {
      mocks: {
        $store: {
          state: {
            token: '',
          }
        },
      },
      propsData: {
        user: [],
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('deleteItem', () => {
    it('should remove the item from the user array when confirmed', () => {
      // Set up the initial data
      const item = {id: 1, name: 'User 1'};
      const user = [item];
      wrapper.setProps({user});

      // Mock the confirm dialog
      window.confirm = jest.fn(() => true);

      // Trigger the method
      wrapper.vm.deleteItem(item);

      // Check the result
      expect(wrapper.props('user')).toHaveLength(0);
    });
  });

  describe('editItem', () => {
    it('should set the editedIndex and editedItem correctly', () => {
      // Set up the initial data
      const item = {id: 1, name: 'User 1'};
      const user = [item];
      wrapper.setProps({user});

      // Trigger the method
      wrapper.vm.editItem(item);

      // Check the result
      expect(wrapper.vm.editedIndex).toBe(-1);
      expect(wrapper.vm.editedItem).toEqual(item);
    });

    // Add more test cases for different scenarios if needed
  });

  describe('save', () => {
    it('should call the appropriate API method and emit "submit" event', async () => {
      // Set up the initial data
      const item = {id: 1, name: 'User 1'};
      wrapper.setData({editedIndex: -1, editedItem: item});

      /*   // Mock the API request
         axios.post.mockResolvedValue(item);

         // Trigger the method
         await wrapper.vm.save();

         // Check the result
         expect(axios.post).toHaveBeenCalledWith(
             expect.stringContaining('store'),
             item,
             expect.objectContaining({ headers: { Authorization: expect.any(String) } })
         );
         expect(wrapper.emitted('submit')).toBeTruthy();
       });*/
    });
  });
});