import Link from "next/link";
import Image from "next/image";
import { Wrench, Car, Clock, ShieldCheck, ArrowRight, Star, MapPin, Phone, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-blue-900 to-zinc-900 dark:from-white dark:to-zinc-400">
              Taller Ricardo
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#servicios" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Servicios
            </Link>
            <Link href="#nosotros" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Nosotros
            </Link>
            <Link href="#contacto" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contacto
            </Link>
          </div>
          <Link
            href="/login"
            className="group px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
          >
            Acceder
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          <Image
            src="/images/miata3.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Star className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
            <span>Servicio Mecánico Premium</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Cuidamos tu vehículo como si fuera <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">el nuestro</span>.
          </h1>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Diagnóstico preciso, repuestos de calidad y los mejores profesionales a tu disposición. Agenda tu cita hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              Agendar Cita
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#servicios"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 rounded-full font-semibold hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
            >
              Ver Servicios
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-300">
            {[
              { label: "Años de Exp.", value: "15+" },
              { label: "Clientes Felices", value: "2.5k+" },
              { label: "Vehículos Reparados", value: "5k+" },
              { label: "Garantía", value: "100%" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="servicios" className="py-24 bg-zinc-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Soluciones Integrales</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Desde mantenimiento preventivo hasta reparaciones complejas, cubrimos todas las necesidades de tu automóvil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: "Mecánica General",
                desc: "Reparación de motor, transmisión, frenos y suspensión con equipos de última generación."
              },
              {
                icon: Clock,
                title: "Mantenimiento Rápido",
                desc: "Cambios de aceite, filtros y revisiones preventivas en tiempo récord para que sigas tu camino."
              },
              {
                icon: ShieldCheck,
                title: "Diagnóstico Computarizado",
                desc: "Escaneo completo de sistemas electrónicos para detectar fallas con precisión milimétrica."
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-lg font-bold text-white">Taller Ricardo</span>
            </div>
            <p className="mb-6 max-w-sm">
              Tu taller de confianza en la ciudad. Comprometidos con la calidad, la transparencia y la seguridad de tu familia.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Zona Los Lotes,Santa Cruz De La Sierra</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+591 75534581</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>contacto@tallerricardo.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Horarios</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Lunes - Viernes</span>
                <span className="text-white">8:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados</span>
                <span className="text-white">8:00 - 13:00</span>
              </li>
              <li className="flex justify-between text-zinc-600">
                <span>Domingos</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Taller Ricardo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
