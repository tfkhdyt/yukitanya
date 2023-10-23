import Image from "next/image";

export function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-6">
      <div className="flex items-center space-x-3">
        <Image
          src="/img/yukitanya_logo.svg"
          alt="Yukitanya Logo"
          width={60}
          height={57}
          className="-mt-4"
        />
        <p className="font-rubik text-2xl font-extrabold">Yukitanya</p>
      </div>

      <nav className="font-poppins flex items-center space-x-12">
        <p className="text-[#696984]">Home</p>
        <p className="text-[#696984]">Fitur</p>
        <p className="text-[#696984]">Tentang Kami</p>
        <div className="space-x-3">
          <button className="rounded-lg bg-[#F48C06] px-4 py-2 font-bold text-white">
            Masuk
          </button>
          <button className="rounded-lg bg-[#77425A] px-4 py-2 font-bold text-white">
            Daftar
          </button>
        </div>
      </nav>
    </header>
  );
}
