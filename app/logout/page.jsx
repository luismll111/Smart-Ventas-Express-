import Link from "next/link";
export default function Logout(){
  return (
    <div className="p-6 space-y-2">
      <div>Has cerrado sesión (demo).</div>
      <Link href="/login" className="text-blue-600">Volver al login</Link>
    </div>
  );
}
