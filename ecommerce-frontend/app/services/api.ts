import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5091/api",
  
})


//API lấy danh sách nhóm sản phẩm
export const fetchCategories = () => API.get('/categories');

//API tạo mới nhóm sản phẩm
export const createCategory = (
  data: {name: String, description: String}) => API.post(
    '/categories', data);

//API sửa nhóm sản phẩm
export const updateCategory = (id: number, 
  data : {name: String, description: String}) => API.put(
    `/categories/${id}`, data);

//API xóa nhóm sản phẩm
export const deleteCategory = (id: number) => API.delete(
  `/categories/${id}`);




// PRODUCT API
export const fetchProducts = () => API.get("/products", {
  headers: {
    'Content-Type': 'application/json',  // Đảm bảo gửi header hợp lệ
  },});
export const createProduct = (data: any) =>
                  API.post("/products", data);
export const updateProduct = (id: number, data: any) => 
                  API.put(`/products/${id}`, data);
export const deleteProduct = (id: number) => 
                  API.delete(`/products/${id}`);


// Upload image
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/files/upload', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

//Xử lý đăng nhập
export const login = (username: string, password: string) => {
  return API.post("/auth/login", {username, password});
}

export const register = (data: {
  username: string;
  password: string;
  fullName: string;
  role: string;
  phone?: string;
}) => API.post('/auth/register', data);

//Xử lý giỏ hàng
//Thêm sản phẩm vào giỏ
export const addToCart = (data: {productId: number, quantity: number}) => {
  return API.post("/Cart/add", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

//Lấy danh sách sản phẩm trong giỏ
export const fetchCart = () => {
  return API.get("/cart/get", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

//Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = (productId: number, quantity: number) => {
  return API.put('/cart/update-quantity', {productId: productId, quantity}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

//xóa
export const deleteCartItem = (productId: number) =>
  axios.delete(`http://localhost:5091/api/cart/${productId}`);


// Định nghĩa kiểu cho OrderDetail khi tạo đơn
export interface CreateOrderDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

// Định nghĩa kiểu cho payload tạo Order
export interface CreateOrderRequest {
  userId: number;
  totalAmount: number;
  details: CreateOrderDetailRequest[];
}

// Hàm gọi API tạo đơn hàng
export const createOrder = (data: CreateOrderRequest) =>
  API.post('/orders', data);


/** Chi tiết một mặt hàng trong đơn */
export interface OrderDetailDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

/** DTO cho đơn hàng */
export interface OrderDto {
  orderId: number;
  orderDate: string;      // ISO date string, e.g. "2025-06-14T12:34:56.789Z"
  totalAmount: number;
  details: OrderDetailDto[];
}

// Lấy danh sách đơn của user
export const getOrdersByUser = (userId: number) =>
  API.get<OrderDto[]>(`/orders/user/${userId}`);


export const fetchUsers = () => axios.get("http://localhost:5091/api/users");
export const createUser = (data: any) => axios.post("http://localhost:5091/api/users", data);
export const updateUser = (id: number, data: any) => axios.put(`${"http://localhost:5091/api/users"}/${id}`, data);
export const deleteUser = (id: number) => axios.delete(`${"http://localhost:5091/api/users"}/${id}`);

export default API;