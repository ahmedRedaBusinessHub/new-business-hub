async function getGalleryImages() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    url: `/placeholder-${i + 1}.jpg`,
    title: `Gallery Image ${i + 1}`
  }))
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Image Gallery</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 font-semibold">{image.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}