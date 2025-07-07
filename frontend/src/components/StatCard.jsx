function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full ${color}`}>{icon}</div>
        <div>
          <h3 className="text-gray-600 text-lg font-medium mb-2">{title}</h3>
          <div className="flex justify-center">
            <p className="text-4xl font-bold">{value}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
export default StatCard;
