import { Outlet, useLocation, Navigate } from "react-router-dom";

export default function RootLayout() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Faqat login va register sahifalari token YO‘Q bo‘lsa ham kirishga ruxsat
  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.includes(location.pathname);

  // Agar token yo‘q va sahifa maxfiy bo‘lsa, login'ga qaytaramiz
  if (!token && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // Aks holda, sahifani ko‘rsatamiz
  return (
    <div>
      {/* Boshqa umumiy layoutlar bo‘lsa shu yerga qo‘shing */}
      <Outlet />
    </div>
  );
}
