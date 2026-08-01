export const adminStats = {
 totalRevenue: 45250,
 totalOrders: 128,
 totalProducts: 6,
 pendingOrders: 12,
 revenueGrowth: 12.5,
 orderGrowth: 8.3,
 productGrowth: 0,
 pendingGrowth: -2.1,
};

export const revenueByMonth = [
 { month: 'Jan', revenue: 2800 },
 { month: 'Feb', revenue: 3200 },
 { month: 'Mar', revenue: 4100 },
 { month: 'Apr', revenue: 3800 },
 { month: 'May', revenue: 5200 },
 { month: 'Jun', revenue: 4800 },
 { month: 'Jul', revenue: 6100 },
 { month: 'Aug', revenue: 5900 },
 { month: 'Sep', revenue: 6700 },
 { month: 'Oct', revenue: 7200 },
 { month: 'Nov', revenue: 8100 },
 { month: 'Dec', revenue: 7600 },
];

export const topProducts = [
 { name: 'Classic Navy Polo', sales: 45, revenue: 38250 },
 { name: 'Black Premium Polo', sales: 38, revenue: 45600 },
 { name: 'White Slim Fit Polo', sales: 32, revenue: 30400 },
 { name: 'Olive Crew Neck', sales: 28, revenue: 18200 },
 { name: 'Charcoal V-Neck', sales: 24, revenue: 14400 },
];

export const categoryBreakdown = [
 { category: 'Polos', count: 3, revenue: 114250, percentage: 65 },
 { category: 'T-Shirts', count: 3, revenue: 47000, percentage: 35 },
];

export const orders = [
 { id: 'ord_001', customerName: 'Rafiq Hasan', phone: '01712345678', address: '42 Gulshan Avenue, Dhaka', items: [{ productId: 'p1', quantity: 2 }], totalAmount: 1700, paymentMethod: 'cod', status: 'delivered', createdAt: '2026-06-28T10:30:00Z' },
 { id: 'ord_002', customerName: 'Farhana Sultana', phone: '01798765432', address: '15 Banani Road, Dhaka', items: [{ productId: 't1', quantity: 1 }, { productId: 'p2', quantity: 1 }], totalAmount: 1500, paymentMethod: 'cod', status: 'shipped', createdAt: '2026-06-30T14:15:00Z' },
 { id: 'ord_003', customerName: 'Shahidul Islam', phone: '01655555555', address: '78 Uttara Sector 4, Dhaka', items: [{ productId: 'p3', quantity: 3 }], totalAmount: 3600, paymentMethod: 'cod', status: 'pending_confirmation', createdAt: '2026-07-01T09:45:00Z' },
 { id: 'ord_004', customerName: 'Nusrat Jahan', phone: '01988888888', address: '23 Dhanmondi 27, Dhaka', items: [{ productId: 't2', quantity: 2 }, { productId: 't3', quantity: 1 }], totalAmount: 1900, paymentMethod: 'cod', status: 'confirmed', createdAt: '2026-07-02T11:20:00Z' },
 { id: 'ord_005', customerName: 'Tanvir Ahmed', phone: '01577777777', address: '56 Mohakhali DOHS, Dhaka', items: [{ productId: 'p1', quantity: 1 }], totalAmount: 850, paymentMethod: 'cod', status: 'delivered', createdAt: '2026-06-25T16:00:00Z' },
 { id: 'ord_006', customerName: 'Ayesha Khatun', phone: '01866666666', address: '12 Old Dhaka, Dhaka', items: [{ productId: 't1', quantity: 4 }], totalAmount: 2200, paymentMethod: 'cod', status: 'shipped', createdAt: '2026-06-29T08:30:00Z' },
 { id: 'ord_007', customerName: 'Kamal Hossain', phone: '01744444444', address: '90 Mirpur 10, Dhaka', items: [{ productId: 'p2', quantity: 1 }, { productId: 't3', quantity: 2 }], totalAmount: 2150, paymentMethod: 'cod', status: 'pending_confirmation', createdAt: '2026-07-03T13:10:00Z' },
 { id: 'ord_008', customerName: 'Rima Begum', phone: '01933333333', address: '34 Bashundhara R/A, Dhaka', items: [{ productId: 'p3', quantity: 2 }], totalAmount: 2400, paymentMethod: 'cod', status: 'confirmed', createdAt: '2026-07-01T15:45:00Z' },
 { id: 'ord_009', customerName: 'Jahidul Islam', phone: '01622222222', address: '67 Banasree, Dhaka', items: [{ productId: 't2', quantity: 1 }], totalAmount: 650, paymentMethod: 'cod', status: 'delivered', createdAt: '2026-06-27T12:00:00Z' },
 { id: 'ord_010', customerName: 'Marzia Rahman', phone: '01511111111', address: '8 Baridhara J Block, Dhaka', items: [{ productId: 'p1', quantity: 1 }, { productId: 't1', quantity: 2 }], totalAmount: 1950, paymentMethod: 'cod', status: 'returned', createdAt: '2026-06-22T09:20:00Z' },
 { id: 'ord_011', customerName: 'Sabbir Ahmed', phone: '01899999999', address: '45 Malibagh, Dhaka', items: [{ productId: 'p2', quantity: 2 }], totalAmount: 1900, paymentMethod: 'cod', status: 'shipped', createdAt: '2026-07-02T17:30:00Z' },
 { id: 'ord_012', customerName: 'Tahmina Akhter', phone: '01777777777', address: '112 Shyamoli, Dhaka', items: [{ productId: 't3', quantity: 3 }], totalAmount: 1800, paymentMethod: 'cod', status: 'pending_confirmation', createdAt: '2026-07-04T10:05:00Z' },
];

export interface Customer {
 id: string;
 name: string;
 email: string;
 phone: string;
 totalOrders: number;
 totalSpent: number;
 lastOrderDate: string;
 status: 'active' | 'inactive';
 joinDate: string;
}

export const customers: Customer[] = [
 { id: 'cst_001', name: 'Rafiq Hasan', email: 'rafiq.hasan@gmail.com', phone: '01712345678', totalOrders: 3, totalSpent: 4250, lastOrderDate: '2026-07-10T10:30:00Z', status: 'active', joinDate: '2025-11-15T08:00:00Z' },
 { id: 'cst_002', name: 'Farhana Sultana', email: 'farhana.sultana@yahoo.com', phone: '01798765432', totalOrders: 5, totalSpent: 8700, lastOrderDate: '2026-07-08T14:15:00Z', status: 'active', joinDate: '2025-09-22T10:00:00Z' },
 { id: 'cst_003', name: 'Shahidul Islam', email: 'shahidul.islam@outlook.com', phone: '01655555555', totalOrders: 2, totalSpent: 5400, lastOrderDate: '2026-07-01T09:45:00Z', status: 'active', joinDate: '2026-01-10T12:00:00Z' },
 { id: 'cst_004', name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com', phone: '01988888888', totalOrders: 4, totalSpent: 7600, lastOrderDate: '2026-07-02T11:20:00Z', status: 'active', joinDate: '2025-08-05T09:00:00Z' },
 { id: 'cst_005', name: 'Tanvir Ahmed', email: 'tanvir.ahmed@gmail.com', phone: '01577777777', totalOrders: 6, totalSpent: 12200, lastOrderDate: '2026-07-12T16:00:00Z', status: 'active', joinDate: '2025-06-18T07:00:00Z' },
 { id: 'cst_006', name: 'Ayesha Khatun', email: 'ayesha.khatun@yahoo.com', phone: '01866666666', totalOrders: 1, totalSpent: 2200, lastOrderDate: '2026-06-29T08:30:00Z', status: 'active', joinDate: '2026-03-20T11:00:00Z' },
 { id: 'cst_007', name: 'Kamal Hossain', email: 'kamal.hossain@gmail.com', phone: '01744444444', totalOrders: 3, totalSpent: 5100, lastOrderDate: '2026-07-03T13:10:00Z', status: 'active', joinDate: '2025-12-01T14:00:00Z' },
 { id: 'cst_008', name: 'Rima Begum', email: 'rima.begum@outlook.com', phone: '01933333333', totalOrders: 2, totalSpent: 3800, lastOrderDate: '2026-07-01T15:45:00Z', status: 'active', joinDate: '2026-02-14T10:00:00Z' },
 { id: 'cst_009', name: 'Jahidul Islam', email: 'jahidul.islam@gmail.com', phone: '01622222222', totalOrders: 1, totalSpent: 650, lastOrderDate: '2026-06-27T12:00:00Z', status: 'inactive', joinDate: '2026-04-05T09:00:00Z' },
 { id: 'cst_010', name: 'Marzia Rahman', email: 'marzia.rahman@yahoo.com', phone: '01511111111', totalOrders: 2, totalSpent: 3900, lastOrderDate: '2026-06-22T09:20:00Z', status: 'inactive', joinDate: '2025-10-30T08:00:00Z' },
 { id: 'cst_011', name: 'Sabbir Ahmed', email: 'sabbir.ahmed@gmail.com', phone: '01899999999', totalOrders: 4, totalSpent: 6800, lastOrderDate: '2026-07-02T17:30:00Z', status: 'active', joinDate: '2025-07-12T11:00:00Z' },
 { id: 'cst_012', name: 'Tahmina Akhter', email: 'tahmina.akhter@gmail.com', phone: '01777777777', totalOrders: 3, totalSpent: 4500, lastOrderDate: '2026-07-04T10:05:00Z', status: 'active', joinDate: '2026-01-25T15:00:00Z' },
];

export const recentOrders = orders;
