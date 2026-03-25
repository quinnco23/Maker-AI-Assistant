import machines from "@/data/machines-with-qr.json";

export default function MachineList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {machines.map((machine) => (
        <div key={machine.slug} className="rounded-2xl border p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold">
            {machine.manufacturer} {machine.model}
          </h3>

          <p className="text-sm text-slate-500">{machine.machineType}</p>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={machine.qrImagePath}
              alt={`QR code for ${machine.manufacturer} ${machine.model}`}
              className="h-24 w-24 rounded-md border"
            />

            <div className="space-y-2 text-sm">
              <a
                href={machine.landingPageUrl}
                className="block text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Machine page
              </a>

              {machine.manualUrl && (
                <a
                  href={machine.manualUrl}
                  className="block text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Manual
                </a>
              )}

              {machine.manufacturerUrl && (
                <a
                  href={machine.manufacturerUrl}
                  className="block text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Manufacturer
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}