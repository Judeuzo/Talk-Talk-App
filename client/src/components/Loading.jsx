// components/Loading.jsx
export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center bg-primary justify-center h-full w-full py-5">
      <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 border-black mb-4"></div>
      <p className=" font-medium">{message}</p>
    </div>
  );
}
