React + Vite 
plinko app

Dockerize:
-docker build -t plinko-2025:dev
- docker run -p 5173:5173 --env-file .env plinko-2025:dev

Công nghệ & Thư viện Sử Dụng
React TypeScript: Xây dựng giao diện và logic game theo hướng component, đảm bảo code mạnh mẽ và dễ bảo trì.
PixiJS: Render đồ họa 2D mượt mà, hỗ trợ hiệu ứng vật lý, ánh sáng và chuyển động trong game.
Zustand: Quản lý trạng thái game (vị trí bóng, bảng điểm, hiệu ứng) với API tối giản nhưng mạnh mẽ.