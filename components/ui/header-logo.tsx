import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'

export default function HeaderLogo() {
  return (
    <div className="shrink-0 mr-4">
      {/* Logo */}
      <Link className="block group" href="/" aria-label="Cruip">
        <Image src={Logo} width={32} height={32} priority alt="Strategic Machines" />
      </Link>
    </div>
  )
}
