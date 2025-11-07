async function getProject(id) {
  // In production, this would fetch from your API
  const projects = {
    '1': { id: 1, name: "Smart Agriculture System", description: "IoT-based system for monitoring and automating agricultural processes. This innovative solution helps farmers optimize their crop yields through real-time data monitoring and automated irrigation systems.", images: ["/placeholder1.jpg", "/placeholder2.jpg"] },
    '2': { id: 2, name: "Healthcare Mobile App", description: "Mobile application connecting patients with healthcare providers. Features include appointment scheduling, telemedicine consultations, and medical record management.", images: ["/placeholder1.jpg"] },
    '3': { id: 3, name: "E-commerce Platform", description: "Local marketplace for artisans and small businesses. Empowering Saudi entrepreneurs to reach customers across the kingdom.", images: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"] },
  }
  return projects[id] || projects['1']
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.id)

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
        <div className="grid gap-4 mb-8">
          {project.images.map((img, index) => (
            <div key={index} className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 font-semibold">Project Image {index + 1}</span>
            </div>
          ))}
        </div>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
          <p className="text-muted-foreground text-lg">{project.description}</p>
        </div>
      </div>
    </div>
  )
}