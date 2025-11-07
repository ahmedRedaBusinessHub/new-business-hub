import Link from 'next/link'

async function getProjects() {
  // In production, this would fetch from your API
  return [
    { id: 1, name: "Smart Agriculture System", description: "IoT-based system for monitoring and automating agricultural processes", image: "/placeholder.jpg" },
    { id: 2, name: "Healthcare Mobile App", description: "Mobile application connecting patients with healthcare providers", image: "/placeholder.jpg" },
    { id: 3, name: "E-commerce Platform", description: "Local marketplace for artisans and small businesses", image: "/placeholder.jpg" },
    { id: 4, name: "Education Tech Platform", description: "Online learning platform for Saudi students", image: "/placeholder.jpg" },
    { id: 5, name: "Food Delivery Service", description: "Connecting local restaurants with customers", image: "/placeholder.jpg" },
    { id: 6, name: "Smart Home Solutions", description: "IoT solutions for modern Saudi homes", image: "/placeholder.jpg" },
  ]
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Projects</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">Project Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}