export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-2">Invalid or Already Used</h2>
        <p>This QR code is invalid or has already been used.</p>
      </div>
    </div>
  );
}
