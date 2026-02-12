import { ProductTable } from './features/products/components/ProductTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Product Management</h1>
        <ProductTable />
      </div>
    </div>
  );
}

export default App;