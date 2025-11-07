export default function AdminDashboard() {
  const stats = [
    { label: 'Partners', value: '5', color: 'bg-blue-500' },
    { label: 'Projects', value: '12', color: 'bg-green-500' },
    { label: 'Contact Submissions', value: '23', color: 'bg-yellow-500' },
    { label: 'Accelerator Applications', value: '8', color: 'bg-purple-500' },
    { label: 'ISO Requests', value: '4', color: 'bg-red-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}