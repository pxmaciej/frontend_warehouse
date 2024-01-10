import { mount } from '@vue/test-utils';
import CrudProduct from '@/components/CrudProduct';

describe('CrudProduct', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CrudProduct, {
      mocks: {
        $store: {
          state: {
            token: '',
          }
        },
      },
      propsData: {
        products: [],
        categories: [],
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('calculateBrutto', () => {
    it('should calculate the correct brutto value when VAT is "zw"', () => {
      // Set up the initial data
      wrapper.setData({
                        editedItem: {
                          netto: 100,
                          vat: 'zw',
                          brutto: 0, // Make sure brutto is initially set to 0
                        },
                      });

      // Trigger the method
      wrapper.vm.calculateBrutto();

      // Check the result
      expect(wrapper.vm.editedItem.brutto).toBe(100.00);
    });

    it('should calculate the correct brutto value when VAT is not "zw"', () => {
      // Set up the initial data
      wrapper.setData({
                        editedItem: {
                          netto: 100,
                          vat: 23,
                          brutto: 0, // Make sure brutto is initially set to 0
                        },
                      });

      // Trigger the method
      wrapper.vm.calculateBrutto();

      // Check the result
      expect(wrapper.vm.editedItem.brutto).toBe("123.00");
    });
  });

  describe('editItem', () => {
    it('should set the editedIndex and editedItem correctly', () => {
      const products = [
        {id: 1, name: 'Product 1'},
        {id: 2, name: 'Product 2'},
      ];
      const item = products[1];

      // Mount the component with products data
      wrapper.setProps({products});

      // Trigger the method
      wrapper.vm.editItem(item);

      // Check the result
      expect(wrapper.vm.editedIndex).toBe(-1);
      expect(wrapper.vm.editedItem).toEqual(item);
    });

    it('should open the dialog', () => {
      const item = {id: 1, name: 'Product 1'};

      // Trigger the method
      wrapper.vm.editItem(item);

      // Check the result
      expect(wrapper.vm.dialog).toBe(true);
    });
  });

  describe('deleteItem', () => {
    it('should remove the item from the products array when confirmed', () => {
      // Set up the initial data
      const item = { id: 1, name: 'Product 1' };
      const products = [item];
      wrapper.setProps({ products });

      // Mock the confirm dialog
      window.confirm = jest.fn(() => true);

      // Trigger the method
      wrapper.vm.deleteItem(item);

      // Check the result
      expect(wrapper.props('products')).toHaveLength(0);
    });
  });
});