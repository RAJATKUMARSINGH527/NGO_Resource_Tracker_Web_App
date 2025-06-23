
# **✨ NGO_Resource_Tracker_Web_App**

## **🌟 Project Overview**
The **NGO Resource Tracker FullStack Website** is a comprehensive management system that allows NGO organizations to **efficiently track, manage, and coordinate their resources, donations, and logistics operations**. Users can **manage inventory, track donations, coordinate distributions, and maintain donor relationships**. The application provides transparency, accountability, and operational efficiency for humanitarian organizations.

Built with **React (frontend), Node.js/Express (backend), and MongoDB (database)**, this project demonstrates full-stack development for humanitarian sector management.

🔗 **Live Demo:** *([Click here to view the deployed application](https://ngo-resource-tracker-web-app.vercel.app/))*

## **✨ Key Features & Technologies**

### **🌟 Features**
✅ Real-time dashboard with analytics and performance indicators  
✅ Comprehensive inventory management with automated alerts  
✅ Complete donor database with contribution tracking  
✅ Logistics coordination with route optimization  
✅ User Authentication & Role-based access control (Admin/Staff/Volunteer)  
✅ Distribution planning and shipment tracking  
✅ Responsive UI for desktop and mobile devices  
✅ Secure API with JWT-based authentication  
✅ Audit trails and compliance reporting  
✅ Emergency response coordination tools  

### **🛠️ Tech Stack**

**Frontend (React + Vite)**
* React.js (UI framework)
* React Router (Navigation) 
* Tailwind CSS (Styling)
* Lucide-react for icons
* Recharts (Data visualization)
* React Hook Form (Form management)

**Backend (Node.js + Express)**
* Node.js (Server-side runtime)
* Express.js (API framework)
* MongoDB + Mongoose (Database)
* CORS and dotenv
* JWT (Authentication)
* Bcrypt (Password encryption)
* Multer (File uploads)
* Nodemailer (Email notifications)

**Deployment**
* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

## **⚙️ Setup Instructions**

### **🔹 1. Clone the Repository**

```bash
git clone https://github.com/RAJATKUMARSINGH527/NGO_Resource_Tracker_Web_App

cd NGO_Resource_Tracker_Web_App
```

### **🔹 2. Setup Backend**
1️⃣ Navigate to the backend folder:

```bash
cd backend
```

2️⃣ Install dependencies:

```bash
npm install
```

3️⃣ **Create a `.env` file and add your configuration:**

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
SALT_ROUNDS=your_salt_rounds
PORT=your_port
```

4️⃣ **Start the backend server:**

```bash
npm run server
```

Backend runs on http://localhost:5000

### **🔹 3. Setup Frontend**
1️⃣ Navigate to the frontend folder:

```bash
cd ../frontend
```

2️⃣ Install dependencies:

```bash
npm install
```

3️⃣ Start the frontend:

```bash
npm run dev
```

Frontend runs on http://localhost:5173

## **🛠️ API Endpoints**

### **🔹 Authentication Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| POST | `/auth/register` | Register a new user | `{ "name": "John Doe", "email": "john@ngo.org", "password": "123456", "role": "staff" }` |
| POST | `/auth/login` | User login | `{ "email": "john@ngo.org", "password": "123456" }` |
| GET | `/auth/profile` | Get user profile | N/A |
| PUT | `/auth/profile` | Update user profile | `{ "name": "Updated Name", "phone": "1234567890" }` |

### **🔹 Inventory Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/inventory` | Get all inventory items | N/A |
| POST | `/inventory` | Add new inventory item | `{ "name": "Medical Supplies", "quantity": 100, "category": "healthcare", "location": "Warehouse A" }` |
| PUT | `/inventory/:id` | Update inventory item | `{ "quantity": 150, "location": "Warehouse B" }` |
| DELETE | `/inventory/:id` | Delete inventory item | N/A |
| GET | `/inventory/low-stock` | Get low stock alerts | N/A |

### **🔹 Donor Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/donors` | Get all donors | N/A |
| POST | `/donors` | Add new donor | `{ "name": "Jane Smith", "email": "jane@email.com", "phone": "9876543210", "type": "individual" }` |
| PUT | `/donors/:id` | Update donor information | `{ "name": "Updated Name", "phone": "new_phone" }` |
| DELETE | `/donors/:id` | Delete donor | N/A |
| GET | `/donors/:id/donations` | Get donor's donation history | N/A |

### **🔹 Donation Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/donations` | Get all donations | N/A |
| POST | `/donations` | Record new donation | `{ "donorId": "donor123", "amount": 5000, "type": "monetary", "items": [] }` |
| PUT | `/donations/:id` | Update donation status | `{ "status": "received", "notes": "Processed successfully" }` |
| DELETE | `/donations/:id` | Delete donation record | N/A |

### **🔹 Distribution Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/distributions` | Get all distributions | N/A |
| POST | `/distributions` | Plan new distribution | `{ "items": [{"itemId": "item123", "quantity": 50}], "location": "Community Center", "date": "2024-12-01" }` |
| PUT | `/distributions/:id` | Update distribution status | `{ "status": "completed", "actualQuantity": 48 }` |
| DELETE | `/distributions/:id` | Cancel distribution | N/A |
| GET | `/distributions/:id/tracking` | Track distribution shipment | N/A |

### **🔹 Analytics Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/analytics/dashboard` | Get dashboard metrics | N/A |
| GET | `/analytics/inventory` | Get inventory analytics | N/A |
| GET | `/analytics/donations` | Get donation analytics | N/A |
| GET | `/analytics/impact` | Get impact reports | N/A |

### **🔹 User Management Routes**
| **Method** | **Endpoint** | **Description** | **Request Body** |
|------------|--------------|-----------------|------------------|
| GET | `/users` | Get all users (Admin only) | N/A |
| PUT | `/users/:id/role` | Update user role (Admin only) | `{ "role": "admin" }` |
| DELETE | `/users/:id` | Delete user (Admin only) | N/A |
| GET | `/users/:id/activity` | Get user activity logs | N/A |

## **🌐 Deployment Links**

**Frontend (Vercel):** **[Live App](https://ngo-resource-tracker-web-app.vercel.app/)** *(Frontend Deployed Link Here)*  
**Backend (Render):** **[Live API](your-backend-deployment-link)** *(Backend Deployed Link Here)*

## **👥 User Roles & Permissions**

### **🔹 Admin**
- Full system access
- User management
- System configuration
- Advanced analytics
- Audit trail access

### **🔹 Staff**
- Inventory management
- Donor management
- Distribution planning
- Basic analytics
- Data entry

### **🔹 Volunteer**
- Limited inventory access
- Distribution support
- Data entry assistance
- Basic reporting

## **🚀 Future Enhancements**

✨ Mobile application for field workers  
✨ Integration with financial management systems  
✨ Advanced AI-powered analytics and insights  
✨ Multi-language support for international operations  
✨ Integration with external logistics providers  
✨ Automated compliance reporting tools  
✨ Real-time chat and collaboration features  
✨ Advanced document management system  

## **📱 Screenshots & Demo**

*Add screenshots of key features here:*
- Dashboard Overview
- Inventory Management
- Donor Database
- Distribution Planning
- Analytics Reports

## **🤝 Contributing**

We welcome contributions from the developer and NGO community:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## **📞 Support & Documentation**

- **User Manual:** Comprehensive guides for all features
- **API Documentation:** Detailed endpoint documentation
- **Video Tutorials:** Step-by-step training videos
- **Community Forum:** Connect with other NGO users
- **Technical Support:** Contact for technical assistance

## **📄 License**

This project is open-source and available under the **MIT License**.

---

**Making humanitarian work more efficient, transparent, and impactful - one organization at a time.** 🌍❤️

*Built with ❤️ for the humanitarian community*