import Image from 'next/image'

interface MdxImageProps {
  src?: string
  alt?: string
}

export function MdxImage({ src, alt = '' }: MdxImageProps) {
  if (!src) return null

  return (
    <span className="block my-6">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className="rounded-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        loading="lazy"
      />
    </span>
  )
}
