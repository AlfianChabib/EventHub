import Image from 'next/image';
import Link from 'next/link';
import Logo from '/public/logo.png';


export default function Footer() {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper items-center justify-center flex-between flex flex-col gap-4 p-5 mt-5text-center sm:flex-row">
        <Link href='/'>
          <Image
            src={Logo}
            alt="logo"
            width={20}
            height={20}
          />
        </Link>
        <p>2024 EventHub. All Rights reserved.</p>
      </div>
    </footer>
  );
}
