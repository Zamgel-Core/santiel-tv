//📍 Ruta: src/components/portal/CustomerPanel.tsx

import { Crown, Ticket } from "lucide-react";

interface Props {
  user: any;
}

export default function CustomerPanel({ user }: Props) {
  return (
    <div className="rounded-[32px] border border-yellow-500/20 bg-[#090909] p-6 text-white">
      <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
        <Crown className="h-5 w-5" />
        Premium activo
      </div>

      <h2 className="mt-4 text-4xl font-black">
        {user.username}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-yellow-400">
            <Ticket className="h-5 w-5" />
            Boletos
          </div>

          <p className="mt-3 text-4xl font-black text-yellow-400">
            {user.total_tickets || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-neutral-400">
            Código referido
          </p>

          <p className="mt-3 text-3xl font-black text-yellow-400">
            {user.referral_code}
          </p>
        </div>
      </div>
    </div>
  );
}