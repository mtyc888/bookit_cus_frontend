export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-blue-500">Processing your booking...</h2>
                <p className="text-gray-500 mt-2">Please wait a moment</p>
            </div>
        </div>
    );
}