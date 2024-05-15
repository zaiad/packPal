import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Upload, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchProductsRequest, fetchProductsSuccess, fetchProductsFailure, addProduct, updateProduct, deleteProduct } from '../Redux/actions/Products';
import { createProduct, fetchProducts, updateProduct as updateProductAPI, deleteProduct as deleteProductAPI } from '../API/Products';
import {fetchCategories} from '../API/Categories';

const Product = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.Products);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm(); // Initialize form

  const [categories, setCategories] = useState([]); // State to store categories
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(categories => {
        setCategories(categories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []); // Empty dependency array to fetch categories only once when component mounts

  useEffect(() => {
    dispatch(fetchProductsRequest());
    fetchProducts()
      .then((products) => {
        dispatch(fetchProductsSuccess(products));
      })
      .catch((error) => {
        dispatch(fetchProductsFailure(error));
      });
  }, [dispatch]);

  const handleEdit = (record) => {
    setEditedProduct(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Set form fields value when modal opens
  };

  const handleCancel = () => {
    form.resetFields();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditedProduct(null);
    setFile(null); // Reset file state
    setImageUrl(''); // Reset image URL state
    setSizes([]); // Reset sizes state
    setColors([]); // Reset colors state
  };

  const handleAddProduct = async () => {
    try {
      const values = await form.validateFields();
      const categoryId = values.category;
    
      // Fetch the category name using the category ID
      const category = categories.find(cat => cat._id === categoryId);
      const categoryName = category ? category.name : '';


      const newProductData = { ...values, category_id: categoryName, media: imageUrl, size: sizes, color: colors }; // Use imageUrl instead of form value
      await createProduct(newProductData);
      dispatch(addProduct(newProductData));
      form.resetFields();
      setAddModalVisible(false);
      setFile(null); // Reset file state
      setImageUrl(''); // Reset image URL state
      setSizes([]); // Reset sizes state
      setColors([]); // Reset colors state
      message.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedProductData = { ...values, media: imageUrl, size: sizes, color: colors }; // Use imageUrl instead of form value
      await updateProductAPI(editedProduct._id, updatedProductData);
      dispatch(updateProduct(editedProduct._id, updatedProductData)); // Dispatch update action
      setEditModalVisible(false);
      setEditedProduct(null);
      setFile(null); // Reset file state
      setImageUrl('');
      setSizes([]); // Reset sizes state
      setColors([]); // Reset colors state
      message.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  const handleDelete = async (productId) => {
    try {
      await deleteProductAPI(productId);
      dispatch(deleteProduct(productId)); // Dispatch delete action
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const url = info.file.response.secure_url;
      setImageUrl(url);
    }
  };

  const uploadProps = {
    action: 'https://api.cloudinary.com/v1_1/drukcn21i/upload',
    data: { upload_preset: 'duqax7wj' },
    onChange: handleChange,
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" style={{ width: 90 }} onClick={() => handleReset(clearFilters)}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const buttonStyle = {
    backgroundColor: '#0C2D57',
    borderColor: '#0C2D57',
    color: '#ffffff',
  };

  const handleSizeChange = (value, index) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };

  const removeSize = (index) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(index, 1);
    setSizes(updatedSizes);
  };

  const addSize = () => {
    setSizes([...sizes, '']);
  };

  const handleColorChange = (value, index) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const removeColor = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([...colors, '']);
  };

  let productIdCounter = (pagination.current - 1) * pagination.pageSize + 1; // Initialize the counter for Product IDs

  const displayedIds = products.map(() => productIdCounter++); // Increment the counter for each displayed product

  const columns = [
    {
      title: 'Product ID',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      render: (_, record, index) => displayedIds[index],
    },
    {
      title: 'Category_id',
      dataIndex: 'category_id',
      key: 'category_id',
      align: 'center',
      ...getColumnSearchProps('category_id'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      // Remove getColumnSearchProps for Description column
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      // Remove getColumnSearchProps for Price column
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (size) => (
        <div>
          {size.map((value, index) => (
            <span key={index} style={{ backgroundColor: index % 2 === 0 ? '#d9a74a' : '#0C2D57', padding: '4px', borderRadius: '4px', marginRight: '4px', color: '#ffffff' }}>{value}</span>
          ))}
        </div>
      ),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
      render: (color) => (
        <div>
          {color.map((value, index) => (
            <span key={index} style={{ backgroundColor: index % 2 === 0 ? '#d9a74a' : '#0C2D57', padding: '4px', borderRadius: '4px', marginRight: '4px', color: '#ffffff' }}>{value}</span>
          ))}
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      // Remove getColumnSearchProps for Quantity column
    },
    {
      title: 'Image',
      dataIndex: 'media',
      key: 'media',
      align: 'center',
      render: (media) => <img src={media} alt="Image" style={{ display: 'block', margin: '0 auto', maxWidth: '100px' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <EditOutlined />
          </Button>
          <Button type="link" onClick={() => handleDelete(record._id)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <DeleteOutlined />
          </Button>
        </span>
      ),
    },
  ];
  

  return (
    <div style={{ overflowX: 'auto' }}>
    <Button
    type="primary"
    onClick={() => setAddModalVisible(true)}
    icon={<PlusOutlined />}
    style={{ backgroundColor: '#0C2D57', color: '#ffffff', marginBottom: '10px' }}
  >
    Add Product
  </Button>
  <Modal
  title="Add Product"
  visible={addModalVisible}
  onOk={handleAddProduct}
  onCancel={handleCancel}
  okButtonProps={{ style: { backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' } }}
  cancelButtonProps={{ style: { backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' } }}
>
    <Form form={form} layout="vertical">
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select
          placeholder="Select category"
        >
          {categories.map(category => (
            <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item label="Size">
  {sizes.map((size, index) => (
    <Input
      key={index}
      value={size}
      onChange={(e) => handleSizeChange(e.target.value, index)}
      style={{ borderColor: '#0C2D57', color: '#0C2D57', marginBottom: 8 }}
      addonAfter={<Button onClick={() => removeSize(index)} style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}><DeleteOutlined /></Button>}
    />
  ))}
  <Button type="dashed" onClick={addSize} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', borderColor: '#0C2D57' }}>
    Add Size
  </Button>
</Form.Item>

<Form.Item label="Color">
  {colors.map((color, index) => (
    <Input
      key={index}
      value={color}
      onChange={(e) => handleColorChange(e.target.value, index)}
      style={{ borderColor: '#0C2D57', color: '#0C2D57', marginBottom: 8 }}
      addonAfter={<Button onClick={() => removeColor(index)} style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}><DeleteOutlined /></Button>}
    />
  ))}
      <Button type="dashed" onClick={addColor} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', borderColor: '#0C2D57' }}>
        Add Color
      </Button>
    </Form.Item>
    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="media" label="Image" rules={[{ required: true }]}>
      <Upload {...uploadProps}>
        <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  </Form>
</Modal>

<Modal
  title="Edit Product"
  visible={editModalVisible}
  onOk={handleUpdate}
  onCancel={handleCancel}
  okButtonProps={{ style: { ...buttonStyle, backgroundColor: '#0C2D57' } }}
  cancelButtonProps={{ style: { ...buttonStyle, backgroundColor: '#0C2D57' } }}
  style={{ backgroundColor: '#0C2D57' }} // Set background color of modal
>
  <Form form={form} layout="vertical" initialValues={editedProduct}>
    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
      <Select placeholder="Select category" style={{ borderColor: '#0C2D57', color: '#0C2D57' }}>
        {categories.map(category => (
          <Select.Option key={category.name} value={category.name}>{category.name}</Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item label="Size">
      {sizes.map((size, index) => (
        <Input
          key={index}
          value={size}
          onChange={(e) => handleSizeChange(e.target.value, index)}
          style={{ borderColor: '#0C2D57', color: '#0C2D57', marginBottom: 8 }}
          addonAfter={<Button onClick={() => removeSize(index)} style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}><DeleteOutlined /></Button>}
        />
      ))}
      <Button type="dashed" onClick={addSize} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', borderColor: '#0C2D57' }}>
        Add Size
      </Button>
    </Form.Item>
    <Form.Item label="Color">
      {colors.map((color, index) => (
        <Input
          key={index}
          value={color}
          onChange={(e) => handleColorChange(e.target.value, index)}
          style={{ borderColor: '#0C2D57', color: '#0C2D57', marginBottom: 8 }}
          addonAfter={<Button onClick={() => removeColor(index)} style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}><DeleteOutlined /></Button>}
        />
      ))}
      <Button type="dashed" onClick={addColor} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', borderColor: '#0C2D57' }}>
        Add Color
      </Button>
    </Form.Item>
    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="media" label="Image" rules={[{ required: true }]}>
      <Upload {...uploadProps}>
        <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  </Form>
</Modal>

<Table 
  columns={columns} 
  dataSource={products} 
  pagination={{ 
    ...pagination,
    itemRender: (current, type, originalElement) => {
      if (type === 'prev' || type === 'next') {
        return <Button style={{  borderColor: '#d9a74a', color: 'white' }}>{originalElement}</Button>;
      }
      return originalElement;
    },
  }} // Pass pagination state to the Table component with custom itemRender function
  onChange={setPagination} // Handle pagination change
/>
</div>
);
};

export default Product;
