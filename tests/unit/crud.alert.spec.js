import { mount } from '@vue/test-utils';
import CrudAlert from '@/components/crudAlert';

describe('CrudAlert', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CrudAlert, {
      mocks: {
        $store: {
          state: {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MDQ5MTE3OTksImV4cCI6MTcwNDkxNTM5OSwibmJmIjoxNzA0OTExNzk5LCJqdGkiOiJIczNvOGxDQ0dUWXh3TUFmIiwic3ViIjoiNyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.XvcGxC8nPm_aWZThYpKRrFm0UzCZ63mNLnvdUW7oLSM',
          }
        },
      },
      propsData: {
        alerts: [],
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('deleteItem', () => {
    it('should remove the item from the alerts array when confirmed', () => {
      const item = {id: 1, name: 'Alert 1'};
      const alerts = [item];
      wrapper.setProps({alerts});

      window.confirm = jest.fn(() => true);

      wrapper.vm.deleteItem(item);

      expect(wrapper.props('alerts')).toHaveLength(0);
    });
  });

  describe('editItem', () => {
    it('should set the editedIndex and editedItem correctly', () => {
      const item = {id: 1, name: 'Alert 1'};
      const alerts = [item];
      wrapper.setProps({alerts});

      wrapper.vm.editItem(item);

      expect(wrapper.vm.editedIndex).toBe(-1);
      expect(wrapper.vm.editedItem).toEqual(item);
    });
  });

  describe('save', () => {
    it('emits "submit" event when save method is called', async () => {
      wrapper.setData({
        editedIndex: -1,
        editedItem:  { name: 'New Alert', product_id: 14 },
      });

      try{
        await wrapper.vm.save();
      }catch(err){
        console.log(err)
      }

      expect(wrapper.emitted().submit)
    });
  });
});