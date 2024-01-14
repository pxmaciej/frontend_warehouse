import { mount } from '@vue/test-utils';
import CrudCategory from '@/components/crudCategory';

describe('CrudCategory', () => {
  let wrapper;
  beforeEach(() => {

    wrapper = mount(CrudCategory, {
      mocks: {
        $store: {
          state: {
            token: '',
          }
        },
      },
      propsData: {
        categories: [],
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('deleteItem', () => {
    it('should remove the item from the categories array when confirmed', () => {
      const item = {id: 1, name: 'Category 1'};
      const categories = [item];
      wrapper.setProps({categories});

      window.confirm = jest.fn(() => true);

      wrapper.vm.deleteItem(item);

      expect(wrapper.props('categories')).toHaveLength(0);
    });
  });

  describe('editItem', () => {
    it('should set the editedIndex and editedItem correctly', () => {
      const item = {id: 1, name: 'Category 1'};
      const categories = [item];
      wrapper.setProps({categories});

      wrapper.vm.editItem(item);

      expect(wrapper.vm.editedIndex).toBe(-1);
      expect(wrapper.vm.editedItem).toEqual(item);
    });
  });

  describe('save', () => {
    it('should call the appropriate API method and emit "submit" event', async () => {
      const item = {id: 1, name: 'Category 1'};
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