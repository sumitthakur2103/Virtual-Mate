# Virtual-Mate: Real-Time Communication Web Application

Virtual-Mate is a full-stack web application designed for seamless real-time communication. It enables users to connect via video conferencing, share screens, and exchange instant messages, making it ideal for virtual meetings and collaboration.

## Live Demo
Check out the live version of the project: Virtual-Mate : https://virtual-mate.vercel.app

## Features
- **Real-Time Video Conferencing**: High-quality video calls with multiple participants.
- **Screen Sharing**: Effortlessly share your screen for presentations and collaboration.
- **Instant Messaging**: Stay connected with real-time chat during meetings.
- **User Authentication**: Secure registration and login with token-based authentication.
- **Meeting Management**: Create and join meetings via unique URLs, with meeting history tracking.
- **Responsive Design**: Fully responsive UI for desktop, tablet, and mobile devices.

## Technologies Used
### Frontend:
- React
- Vite
- Tailwind CSS
- Material-UI
- Socket.IO Client

### Backend:
- Node.js
- Express.js
- MongoDB
- Socket.IO
- Mongoose

### Deployment:
- Frontend: Vercel
- Backend: Render

## Installation and Setup
### Prerequisites:
- Node.js (v18.x or higher)
- MongoDB (local or cloud instance)

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sumitthakur2103/Virtual-Mate.git
   cd virtual-mate
   ```

2. **Install Dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Configuration**:
   - Backend: Update MongoDB connection string in `src/app.js`.
   - Frontend: Update the server URL in `src/enviroment.js`.

4. **Run the Application**:
   - Start the backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

## Deployment
- **Frontend**: Deployed on Vercel for fast and scalable hosting.
- **Backend**: Deployed on Render with WebSocket support for real-time communication.

## Screenshots
![Screenshot 2025-04-04 124959](https://github.com/user-attachments/assets/52caee1b-7634-42eb-8e25-2c958a5dac66)
![Screenshot 2025-04-04 125019](https://github.com/user-attachments/assets/dd7f4aba-65ff-4a7f-bc2d-9f04891a3624)
![Screenshot 2025-04-04 125035](https://github.com/user-attachments/assets/70b7e79c-f2ef-41b2-9bdc-661eca514a4e)
![Untitled design](https://github.com/user-attachments/assets/ceb8c579-c140-43a7-baa9-ae388fd88082)
![image](https://github.com/user-attachments/assets/8bce54ed-f23b-42b2-91e1-d621def7823b)
![image](https://github.com/user-attachments/assets/b68f960c-0bd8-4a9e-9664-5fee4868924c)



## Contact
For any queries or contributions, feel free to reach out at : tsumit0505@gmail.com, sumitthakur8511@gmail.com.
