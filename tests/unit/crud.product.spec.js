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
      wrapper.setData({
                        editedItem: {
                          netto: 100,
                          vat: 'zw',
                          brutto: 0,
                        },
                      });

      wrapper.vm.calculateBrutto();

      expect(wrapper.vm.editedItem.brutto).toBe(100.00);
    });

    it('should calculate the correct brutto value when VAT is not "zw"', () => {
      wrapper.setData({
                        editedItem: {
                          netto: 100,
                          vat: 23,
                          brutto: 0,
                        },
                      });

      wrapper.vm.calculateBrutto();

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

      wrapper.setProps({products});

      wrapper.vm.editItem(item);

      expect(wrapper.vm.editedIndex).toBe(-1);
      expect(wrapper.vm.editedItem).toEqual(item);
    });

    it('should open the dialog', () => {
      const item = {id: 1, name: 'Product 1'};

      wrapper.vm.editItem(item);

      expect(wrapper.vm.dialog).toBe(true);
    });
  });

  describe('deleteItem', () => {
    it('should remove the item from the products array when confirmed', () => {
      const item = { id: 1, name: 'Product 1' };
      const products = [item];
      wrapper.setProps({ products });

      window.confirm = jest.fn(() => true);

      wrapper.vm.deleteItem(item);

      expect(wrapper.props('products')).toHaveLength(0);
    });
  });
});