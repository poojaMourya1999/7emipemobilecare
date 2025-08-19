// pages/NotFound.jsx
const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-indigo-500">404</h1>
      <p className="text-xl text-gray-600 mt-2">Page Not Found</p>
      <a href="/" className="mt-4 text-indigo-600 underline">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
